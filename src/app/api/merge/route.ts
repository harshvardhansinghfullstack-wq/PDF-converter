import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs"; // ensure Node.js environment

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: "Please upload at least two PDF files to merge." },
        { status: 400 }
      );
    }

    // ✅ Create a new empty PDF document
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      if (!file.type.includes("pdf")) continue;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // ✅ Serialize merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // ✅ Return as binary (not corrupted)
    return new NextResponse(mergedPdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
        "Content-Length": mergedPdfBytes.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("Merge error:", err);
    return NextResponse.json(
      { error: `Merge failed: ${err.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
