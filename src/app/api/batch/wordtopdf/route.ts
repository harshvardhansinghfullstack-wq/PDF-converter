import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const timestamp = Date.now();
  const uploadDir = path.join(tmpdir(), `batch-docx-${timestamp}`);
  const outputDir = path.join(tmpdir(), `batch-out-${timestamp}`);

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Prepare directories
    await fs.promises.mkdir(uploadDir, { recursive: true });
    await fs.promises.mkdir(outputDir, { recursive: true });

    const pdfPaths: string[] = [];

    // Write and convert each file
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const tempDocxPath = path.join(uploadDir, safeName);
      await fs.promises.writeFile(tempDocxPath, buffer);

      const convertCommand = `libreoffice --headless --nologo --nolockcheck --convert-to pdf --outdir "${outputDir}" "${tempDocxPath}"`;
      console.log(`[Converting] ${file.name}`);
      const { stdout, stderr } = await execAsync(convertCommand);
      console.log("[LibreOffice stdout]", stdout || "(empty)");
      console.error("[LibreOffice stderr]", stderr || "(empty)");

      const baseName = path.parse(file.name).name;
      const pdfName = `${baseName}.pdf`;
      const pdfFullPath = path.join(outputDir, pdfName);

      if (!fs.existsSync(pdfFullPath)) {
        throw new Error(`Failed to convert ${file.name} to PDF`);
      }

      pdfPaths.push(pdfFullPath);
    }

    // Create ZIP file in memory
    const zipPath = path.join(tmpdir(), `converted-${timestamp}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    const zipFinished = new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      output.on("close", async () => {
        const zipBuffer = await fs.promises.readFile(zipPath);
        resolve(zipBuffer);
      });
      archive.on("error", reject);
    });

    archive.pipe(output);

    for (const pdfPath of pdfPaths) {
      archive.file(pdfPath, { name: path.basename(pdfPath) });
    }

    await archive.finalize();
    const zipBuffer = await zipFinished;

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="converted_pdfs.zip"',
      },
    });
  } catch (error: any) {
    console.error("Batch conversion error:", error);
    return NextResponse.json(
      { error: "Batch conversion failed", details: error.message },
      { status: 500 }
    );
  } finally {
    // Cleanup all temp files
    try {
      if (fs.existsSync(uploadDir)) {
        await fs.promises.rm(uploadDir, { recursive: true, force: true });
      }
      if (fs.existsSync(outputDir)) {
        await fs.promises.rm(outputDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
}
