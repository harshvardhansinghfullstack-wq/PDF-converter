import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  let tempPdfPath = '';
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No PDF uploaded." }, { status: 400 });
    }

    const pdfFile = files[0];
    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    const data = await pdfParse(buffer);
    const extractedText = data.text;

    return new NextResponse(extractedText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename=extracted.txt',
      },
    });
  } catch (err: any) {
    console.error("PDF to text error:", err);
    return NextResponse.json({ error: err.message || "Text extraction failed" }, { status: 500 });
  } finally {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
    }
  }
}
