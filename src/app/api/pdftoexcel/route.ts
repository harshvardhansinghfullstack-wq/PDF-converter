import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    const pdfFile = files[0];

    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);
    const text = parsed.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "No text found in PDF" },
        { status: 400 }
      );
    }

    // Split text into rows & columns
    const rows = text
      .split("\n")
      .map((line) =>
        line
          .trim()
          .split(/\s{2,}|\t+/) // split by tabs or multiple spaces
          .filter((cell) => cell.length > 0)
      )
      .filter((row) => row.length > 0);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No table data found in PDF" },
        { status: 400 }
      );
    }

    // Build Excel workbook
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate Excel buffer in memory
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${pdfFile.name.replace(".pdf", ".xlsx")}"`,
        "Content-Length": excelBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error during PDF to Excel conversion:", error);
    return NextResponse.json(
      { error: `Conversion failed: ${error.message}` },
      { status: 500 }
    );
  }
}