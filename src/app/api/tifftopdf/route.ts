import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs"; // needed because sharp uses native modules

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files?.length) {
      return NextResponse.json({ error: "No TIFF files uploaded" }, { status: 400 });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      if (!file.type.includes("tiff") && !file.name.toLowerCase().endsWith(".tiff")) {
        return NextResponse.json({ error: "Only TIFF files are supported" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const pngBuffer = await sharp(Buffer.from(arrayBuffer)).png().toBuffer();
      const img = await mergedPdf.embedPng(pngBuffer);
      const page = mergedPdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const pdfBytes = await mergedPdf.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error: any) {
    console.error("TIFF → PDF conversion error:", error);
    return NextResponse.json({ error: `Conversion failed: ${error.message}` }, { status: 500 });
  }
}
