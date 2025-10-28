import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs"; // ✅ Required: sharp uses native bindings

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files?.length) {
      return NextResponse.json(
        { error: "No TIFF files uploaded" },
        { status: 400 }
      );
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const name = file.name.toLowerCase();

      // ✅ Validate file type
      if (!file.type.includes("tiff") && !name.endsWith(".tiff") && !name.endsWith(".tif")) {
        return NextResponse.json(
          { error: "Only TIFF (.tif / .tiff) files are supported" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 🧩 Handle multi-page TIFFs
      const metadata = await sharp(buffer).metadata();
      const pages = metadata.pages || 1;

      for (let i = 0; i < pages; i++) {
        const pngBuffer = await sharp(buffer, { page: i }).png().toBuffer();
        const img = await mergedPdf.embedPng(pngBuffer);
        const page = mergedPdf.addPage([img.width, img.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        });
      }
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
    console.error("❌ TIFF → PDF conversion error:", error);
    return NextResponse.json(
      { error: `Conversion failed: ${error.message}` },
      { status: 500 }
    );
  }
}
