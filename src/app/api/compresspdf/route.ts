import { IncomingForm, File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { NextRequest } from "next/server";
import { Readable } from "stream";

// Create a mock IncomingMessage with stream support
class MockIncomingMessage extends Readable {
  headers: { [key: string]: string };
  constructor(buffer: Buffer, contentType: string) {
    super();
    this.headers = {
      "content-length": buffer.length.toString(),
      "content-type": contentType,
    };
    this.push(buffer);
    this.push(null); // Signal end of stream
  }
  _read() {} // Required by Readable stream
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const form = new IncomingForm({
    multiples: false,
    uploadDir: "/tmp",
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    keepExtensions: true,
  });

  try {
    // Read the request body as a Buffer
    const buffer = Buffer.from(await req.arrayBuffer());
    const contentType = req.headers.get("content-type") || "multipart/form-data";

    // Create a mock IncomingMessage with the correct Content-Type
    const mockReq = new MockIncomingMessage(buffer, contentType);

    return new Promise((resolve) => {
      // Parse using formidable with mock request
      form.parse(mockReq as any, async (err, fields, files: { file?: File[] }) => {
        if (err) {
          console.error("Form parsing error:", err);
          resolve(
            new Response(
              JSON.stringify({ error: "Failed to parse form data" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            )
          );
          return;
        }

        const file = files.file?.[0];
        if (!file || !file.mimetype?.includes("pdf")) {
          resolve(
            new Response(
              JSON.stringify({ error: "Please upload a single PDF file." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            )
          );
          return;
        }

        const inputPath = file.filepath;
        const safeInputPath = path.resolve("/tmp", path.basename(inputPath));
        const safeOutputPath = path.resolve("/tmp", `compressed-${Date.now()}.pdf`);

        if (!safeInputPath.startsWith("/tmp") || !safeOutputPath.startsWith("/tmp")) {
          resolve(
            new Response(
              JSON.stringify({ error: "Invalid file path" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            )
          );
          return;
        }

        try {
          console.log(`Processing file: ${safeInputPath}, size: ${(await fs.stat(safeInputPath)).size} bytes`);
          await execAsync(
            `qpdf --linearize --object-streams=generate "${safeInputPath}" "${safeOutputPath}"`
          );
          const fileBuffer = await fs.readFile(safeOutputPath);

          resolve(
            new Response(fileBuffer, {
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=compressed_${path.basename(file.originalFilename || "file.pdf")}`,
              },
            })
          );
        } catch (error) {
          console.error("Compression error:", error);
          resolve(
            new Response(
              JSON.stringify({ error: "Compression failed" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            )
          );
        } finally {
          try {
            if (await fs.access(safeInputPath).then(() => true).catch(() => false)) {
              await fs.unlink(safeInputPath);
            }
            if (await fs.access(safeOutputPath).then(() => true).catch(() => false)) {
              await fs.unlink(safeOutputPath);
            }
          } catch (cleanupError) {
            console.error("Cleanup failed:", cleanupError);
          }
        }
      });
    });
  } catch (error) {
    console.error("Request processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}