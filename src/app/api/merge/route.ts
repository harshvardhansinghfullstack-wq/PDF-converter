import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const pdfFile = files[0]; // Assuming we're only dealing with one PDF

  if (!pdfFile.type.includes('pdf')) {
    return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 400 });
  }

  const arrayBuffer = await pdfFile.arrayBuffer();
  let pdfData;
  try {
    // Convert ArrayBuffer to Buffer
    pdfData = await pdfParse(Buffer.from(arrayBuffer)); // <-- Fixed here
  } catch (parseError: unknown) {
    if (parseError instanceof Error) {
      return NextResponse.json(
        { error: `Error parsing PDF: ${parseError.message}` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Unknown error occurred while parsing the PDF' },
      { status: 400 }
    );
  }

  const extractedText = pdfData.text;

  const doc = new Document({
    sections: [
      {
        children: extractedText
          .split('\n')
          .map((line) => new Paragraph({
            children: [new TextRun(line.trim())],
          })),
      },
    ],
  });

  const docBuffer = await Packer.toBuffer(doc);

  return new NextResponse(docBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="converted.docx"',
    },
  });
}
