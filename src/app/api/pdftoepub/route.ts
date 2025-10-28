import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { tmpdir } from "os";
import fs from "fs";
import path from "path";
import EPUB from "epub-gen";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let tempPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const pdfFile = files[0];
    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const plainText = pdfData.text?.trim();

    if (!plainText) {
      return NextResponse.json(
        { error: "No extractable text found in PDF." },
        { status: 400 }
      );
    }

    // Convert extracted text into EPUB chapters
    const chapters = plainText
      .split(/\f+|\n\s*\n\s*\n+/g) // Split by form feed or multiple newlines
      .filter((text) => text.trim().length > 50) // Filter out very short sections
      .map((text, i) => ({
        title: `Chapter ${i + 1}`,
        data: `<p>${text.trim().replace(/\n+/g, "</p><p>")}</p>`,
      }));

    if (chapters.length === 0) {
      return NextResponse.json(
        { error: "Could not extract meaningful content from PDF." },
        { status: 400 }
      );
    }

    // Generate unique temp path
    tempPath = path.join(tmpdir(), `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.epub`);

    // Generate EPUB file
    const epubOptions = {
      title: pdfFile.name.replace(".pdf", "") || "Converted PDF",
      author: "PDF Converter",
      output: tempPath,
      content: chapters,
      version: 3,
    };

    // Create new EPUB and wait for completion
    await new EPUB(epubOptions).promise;

    // Verify file exists before reading
    if (!fs.existsSync(tempPath)) {
      throw new Error("EPUB file generation failed - file not created");
    }

    const epubBuffer = await fs.promises.readFile(tempPath);

    // Verify buffer has content
    if (epubBuffer.length === 0) {
      throw new Error("Generated EPUB file is empty");
    }

    return new NextResponse(epubBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/epub+zip",
        "Content-Disposition": `attachment; filename="${pdfFile.name.replace(".pdf", ".epub")}"`,
        "Content-Length": epubBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("EPUB conversion failed:", error);
    return NextResponse.json(
      {
        error: `EPUB conversion failed: ${error.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  } finally {
    // Cleanup temp file
    try {
      if (tempPath && fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    } catch (cleanupError) {
      console.error("Cleanup failed:", cleanupError);
    }
  }
}