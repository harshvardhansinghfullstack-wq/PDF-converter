import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

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

    tempPdfPath = path.join(tmpdir(), `pdf-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempPdfPath, buffer);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const pageImages: Buffer[] = [];
    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const page = await browser.newPage();
      await page.goto(`file://${tempPdfPath}#page=${i + 1}`, {
        waitUntil: 'networkidle0',
      });
      const screenshot = await page.screenshot({ type: 'png' });
      if (screenshot instanceof Buffer) pageImages.push(screenshot);
      await page.close();
    }

    await browser.close();

    const JSZip = require('jszip');
    const zip = new JSZip();
    pageImages.forEach((img, i) => zip.file(`page-${i + 1}.png`, img));
    const zipData = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipData, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=pdf-images.zip',
      },
    });
  } catch (err: any) {
    console.error("PDF to PNG error:", err);
    return NextResponse.json({ error: err.message || "Conversion failed" }, { status: 500 });
  } finally {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
    }
  }
}
