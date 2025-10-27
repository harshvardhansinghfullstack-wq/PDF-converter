import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';
import { tmpdir } from 'os';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No PDF file uploaded' }), { status: 400 });
    }

    const pdfFile = files[0];
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);
    const text = parsed.text;

    // 🧠 Simple line-by-line split and tab-delimited rows
    const rows = text
      .split('\n')
      .map((line) =>
        line
          .trim()
          .split(/\s{2,}|\t+/) // Split by 2+ spaces or tabs
          .filter((cell) => cell.length > 0)
      )
      .filter((row) => row.length > 0);

    if (rows.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No table data found in PDF' }), { status: 400 });
    }

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const tmpExcelPath = path.join(tmpdir(), `converted-${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, tmpExcelPath);

    const excelBuffer = await fs.readFile(tmpExcelPath);
    await fs.unlink(tmpExcelPath); // Clean up

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="converted.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('Error during PDF to Excel conversion:', error);
    return new NextResponse(
      JSON.stringify({ error: `Conversion failed: ${error.message}` }),
      { status: 500 }
    );
  }
}
