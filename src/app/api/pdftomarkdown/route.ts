import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

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

    const data = await pdfParse(buffer);

    const markdown = `# Extracted Content\n\n${data.text
      .split('\n')
      .map((line) => (line.trim() ? `- ${line.trim()}` : ''))
      .join('\n')}`;

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': 'attachment; filename="converted.md"',
      },
    });
  } catch (error: any) {
    console.error('Error converting PDF to Markdown:', error);
    return new NextResponse(
      JSON.stringify({ error: `Conversion failed: ${error.message}` }),
      { status: 500 }
    );
  }
}
