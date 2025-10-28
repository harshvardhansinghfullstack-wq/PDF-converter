import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { PDFDocument } from 'pdf-lib';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(req: NextRequest) {
  let tempPdfPath = '';
  let browser = null;

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    const pdfFile = files[0];

    if (!pdfFile.type.includes('pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    tempPdfPath = path.join(tmpdir(), `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
    await fs.promises.writeFile(tempPdfPath, buffer);

    browser = await puppeteerCore.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();
    const htmlPages: string[] = [];

    for (let i = 0; i < totalPages; i++) {
      const page = await browser.newPage();
      await page.goto(`file://${tempPdfPath}#page=${i + 1}`, { waitUntil: 'networkidle0' });
      const htmlContent = await page.content();
      htmlPages.push(`<!-- Page ${i + 1} -->\n` + htmlContent);
      await page.close();
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>PDF to HTML - ${pdfFile.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            hr { margin: 2rem 0; border: none; border-top: 2px solid #ccc; }
          </style>
        </head>
        <body>
          ${htmlPages.join('\n<hr />')}
        </body>
      </html>
    `;

    return new NextResponse(fullHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${pdfFile.name.replace('.pdf', '.html')}"`,
        'Content-Length': Buffer.byteLength(fullHtml, 'utf8').toString(),
      },
    });
  } catch (err: any) {
    console.error("PDF to HTML error:", err);
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