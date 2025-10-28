import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No PDF file uploaded" }),
        { status: 400 }
      );
    }

    const pdfFile = files[0];
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);
    const text = parsed.text;

    // 🧠 Split text into rows & columns
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
      return new NextResponse(
        JSON.stringify({ error: "No table data found in PDF" }),
        { status: 400 }
      );
    }

    // 🧾 Build Excel workbook
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // ✅ Generate Excel buffer in memory
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="converted.xlsx"',
      },
    });
  } catch (error: any) {
    console.error("Error during PDF to Excel conversion:", error);
    return new NextResponse(
      JSON.stringify({ error: `Conversion failed: ${error.message}` }),
      { status: 500 }
    );
  }
}
