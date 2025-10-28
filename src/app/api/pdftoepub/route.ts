import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { tmpdir } from "os";
import fs from "fs";
import path from "path";
import EPUB from "epub-gen";

export const runtime = "nodejs"; // ✅ Ensure Node.js APIs like fs and path are available

export async function POST(req: NextRequest) {
  const tempPath = path.join(tmpdir(), `pdf-${Date.now()}.epub`);

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const pdfFile = files[0];
    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Extract text safely
    const pdfData = await pdfParse(buffer);
    const plainText = pdfData.text?.trim();

    if (!plainText) {
      throw new Error("No extractable text in PDF.");
    }

    // ✅ Convert extracted text into EPUB chapters
    const chapters = plainText
      .split(/\f|\n\s*\n/g) // split by form feed or double newlines
      .filter((text) => text.trim().length > 0)
      .map((text, i) => ({
        title: `Section ${i + 1}`,
        data: `<p>${text.replace(/\n/g, "<br/>")}</p>`,
      }));

    // ✅ Generate EPUB file
    const epubOptions = {
      title: "Converted PDF",
      author: "PDF2EPUB",
      output: tempPath,
      content: chapters,
    };

    const generator = new EPUB(epubOptions);
    await generator.promise; // Wait for file generation

    const epubBuffer = await fs.promises.readFile(tempPath);

    return new NextResponse(epubBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/epub+zip",
        "Content-Disposition": 'attachment; filename="converted.epub"',
      },
    });
  } catch (error: any) {
    console.error("EPUB conversion failed:", error);
    return NextResponse.json(
      { error: `EPUB conversion failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  } finally {
    // ✅ Cleanup temp file
    try {
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    } catch (cleanupError) {
      console.error("Cleanup failed:", cleanupError);
    }
  }
}
