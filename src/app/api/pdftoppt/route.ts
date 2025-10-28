import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import PptxGenJS from "pptxgenjs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const pdfFile = files[0];
    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text.trim();

    if (!text) {
      return NextResponse.json({ error: "No text found in PDF" }, { status: 400 });
    }

    // Create PPTX
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";

    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const chunkSize = 10; // Lines per slide
    for (let i = 0; i < lines.length; i += chunkSize) {
      const slide = pptx.addSlide();
      const content = lines.slice(i, i + chunkSize).join("\n");
      slide.addText(content, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 5,
        fontSize: 18,
        color: "000000",
        bold: false,
      });
    }

    const pptxBuffer = await (pptx.write as any)("nodebuffer");

    return new NextResponse(pptxBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="converted.pptx"',
      },
    });
  } catch (err: any) {
    console.error("PDF to PPTX error:", err);
    return NextResponse.json(
      { error: err.message || "Conversion failed" },
      { status: 500 }
    );
  }
}
