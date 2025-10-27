import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files?.length) {
      return new NextResponse(JSON.stringify({ error: 'No PDF uploaded' }), { status: 400 });
    }

    const pdfFile = files[0];
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    const lines = data.text.split('\n');

    // Build simple XML
    const xmlLines = lines
      .map((line, i) => `<line number="${i + 1}">${escapeXml(line)}</line>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n${xmlLines}\n</document>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': 'attachment; filename="converted.xml"',
      },
    });
  } catch (err: any) {
    console.error('PDF → XML conversion failed:', err);
    return new NextResponse(
      JSON.stringify({ error: `Conversion failed: ${err.message}` }),
      { status: 500 }
    );
  }
}

// Utility to escape XML special chars
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
