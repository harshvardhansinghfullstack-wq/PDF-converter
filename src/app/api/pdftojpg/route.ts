import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import puppeteer from 'puppeteer';
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

    tempPdfPath = path.join(tmpdir(), `input-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempPdfPath, buffer);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

    await browser.close();

    const zipFilePath = path.join(tmpdir(), `pdf-images-${Date.now()}.zip`);
    const JSZip = require("jszip");
    const zip = new JSZip();

    jpgBuffers.forEach((img, i) => {
      zip.file(`page-${i + 1}.jpg`, img);
    });

    const zipData = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipData, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=pdf-images.zip',
      },
    });
  } catch (err: any) {
    console.error("PDF to JPG error:", err);
    return NextResponse.json({ error: err.message || "Conversion failed" }, { status: 500 });
  } finally {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
    }
  }
}
