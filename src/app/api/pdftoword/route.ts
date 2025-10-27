import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse'; 
import { Document, Packer, Paragraph } from 'docx'; 

async function convertPdfToDocx(pdfFile: File): Promise<Buffer> {
  const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

  const data = await pdfParse(pdfBuffer);

  console.log('Extracted Text:', data.text);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: data.text.split('\n').map(line => new Paragraph(line)),
      },
    ],
  });

  const docxBuffer = await Packer.toBuffer(doc);
  return docxBuffer;
}

export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

   
    console.log("Uploaded Files:", files);

    if (!files || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'No files provided' }),
        { status: 400 }
      );
    }

    const docFileBuffer = await convertPdfToDocx(files[0]);

    return new NextResponse(docFileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="converted.docx"',
      },
    });
  } catch (error) {
    console.error('Error during PDF to DOCX conversion:', error);
    return new NextResponse(
      JSON.stringify({ error: 'An error occurred during file upload or conversion' }),
      { status: 500 }
    );
  }
}
