import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  let tempPdfPath = "";
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No TIFF files uploaded" }),
        { status: 400 }
      );
    }

    const { PDFDocument } = await import("pdf-lib");

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      // Convert TIFF to PNG buffer (sharp can convert TIFF to PNG)
      const pngBuffer = await sharp(inputBuffer).png().toBuffer();

      // Embed image into pdf-lib PDF page
      const img = await mergedPdf.embedPng(pngBuffer);
      const page = mergedPdf.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });
    }

    const mergedPdfBytes = await mergedPdf.save();

    tempPdfPath = path.join(tmpdir(), `tiff-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempPdfPath, mergedPdfBytes);

    const pdfData = await fs.promises.readFile(tempPdfPath);

    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Error during TIFF to PDF conversion:", error);
    return new NextResponse(
      JSON.stringify({ error: `Conversion failed: ${error.message}` }),
      { status: 500 }
    );
  } finally {
    try {
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temp PDF file:", cleanupError);
    }
  }
}
