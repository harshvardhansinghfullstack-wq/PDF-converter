import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs"; // ✅ ensures Node APIs (like Buffer) work in Next.js

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const pdfFile = files[0]; // Assume single file upload

    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Parse PDF to text
    let pdfData;
    try {
      pdfData = await pdfParse(buffer);
    } catch (err: any) {
      console.error("PDF parse error:", err);
      return NextResponse.json(
        { error: `Error parsing PDF: ${err.message || "Unknown error"}` },
        { status: 400 }
      );
    }

    const extractedText = pdfData.text.trim();
    if (!extractedText) {
      return NextResponse.json(
        { error: "No readable text found in the PDF." },
        { status: 400 }
      );
    }

    // ✅ Create DOCX document
    const doc = new Document({
      sections: [
        {
          children: extractedText.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line.trim())],
              })
          ),
        },
      ],
    });

    const docBuffer = await Packer.toBuffer(doc);

    return new NextResponse(docBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="converted.docx"',
      },
    });
  } catch (error: any) {
    console.error("Error in PDF → DOCX conversion:", error);
    return NextResponse.json(
      { error: `Conversion failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
