import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import PptxGenJS from 'pptxgenjs';
import fs from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

export async function POST(req: NextRequest) {
  let tempPdfPath = '';

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    const pdfFile = files[0];
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();

    tempPdfPath = path.join(tmpdir(), `upload-${Date.now()}.pdf`);
    await fs.writeFile(tempPdfPath, buffer);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    const slideWidth = (pptx as any).width;
    const slideHeight = (pptx as any).height;

    for (let i = 1; i <= totalPages; i++) {
      const page = await browser.newPage();
      await page.goto(`file://${tempPdfPath}#page=${i}`, { waitUntil: 'networkidle0' });
      const screenshot = await page.screenshot({ type: 'jpeg', quality: 80 }) as Buffer;
      const slide = pptx.addSlide();
      slide.addImage({
        data: screenshot.toString('base64'),
        x: 0,
        y: 0,
        w: slideWidth,
        h: slideHeight,
      });
      await page.close();
    }

    await browser.close();
    await fs.unlink(tempPdfPath);

    // ✅ Use 'nodebuffer' with type cast
    const pptxBuffer = await (pptx.write as any)('nodebuffer');

    return new NextResponse(pptxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="converted.pptx"',
      },
    });
  } catch (error: any) {
    console.error('Error during PDF to PPT conversion:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
