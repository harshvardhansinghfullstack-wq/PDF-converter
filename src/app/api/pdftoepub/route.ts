import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { promisify } from 'util';
import { tmpdir } from 'os';
import fs from 'fs';
import path from 'path';

const EPUB = require('epub-gen');

export async function POST(req: NextRequest) {
  const tempPath = path.join(tmpdir(), `pdf-${Date.now()}.epub`);

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No PDF uploaded' }), { status: 400 });
    }

    const pdfFile = files[0];
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);
    const plainText = pdfData.text;

    if (!plainText.trim()) {
      throw new Error("No extractable text in PDF.");
    }

    const chapters = plainText
      .split(/\f/)
      .filter(Boolean)
      .map((text, i) => ({
        title: `Page ${i + 1}`,
        data: `<p>${text.replace(/\n/g, "<br/>")}</p>`,
      }));

    await new EPUB(
      {
        title: "Converted PDF",
        author: "PDF2EPUB",
        output: tempPath,
        content: chapters,
      },
    ).promise;

    const epubBuffer = await fs.promises.readFile(tempPath);

    return new NextResponse(epubBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': 'attachment; filename="converted.epub"',
      },
    });
  } catch (error: any) {
    console.error('EPUB conversion failed:', error);
    return new NextResponse(
      JSON.stringify({ error: `EPUB conversion failed: ${error.message}` }),
      { status: 500 }
    );
  } finally {
    try {
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    } catch (err) {
      console.error("Cleanup failed:", err);
    }
  }
}
