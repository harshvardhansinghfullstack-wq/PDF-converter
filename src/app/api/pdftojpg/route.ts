import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
  let tempPdfPath = '';
  let browser = null;

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const pdfFile = files[0];

    if (!pdfFile.type.includes('pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    tempPdfPath = path.join(tmpdir(), `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
    await fs.promises.writeFile(tempPdfPath, buffer);

    browser = await puppeteerCore.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const jpgBuffers: Buffer[] = [];

    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const page = await browser.newPage();
      await page.goto(`file://${tempPdfPath}#page=${i + 1}`, { waitUntil: 'networkidle0' });
      const screenshot = await page.screenshot({ type: 'jpeg', quality: 90 });
      if (screenshot instanceof Buffer) jpgBuffers.push(screenshot);
      await page.close();
    }

    if (jpgBuffers.length === 0) {
      return NextResponse.json({ error: "No images could be generated from PDF" }, { status: 400 });
    }

    const zip = new JSZip();

    jpgBuffers.forEach((img, i) => {
      zip.file(`page-${i + 1}.jpg`, img);
    });

    const zipData = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipData, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${pdfFile.name.replace('.pdf', '-images.zip')}"`,
        'Content-Length': zipData.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("PDF to JPG error:", err);
    return NextResponse.json({ error: err.message || "Conversion failed" }, { status: 500 });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
    try {
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }
  }
}