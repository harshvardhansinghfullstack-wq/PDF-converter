import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { PDFDocument } from 'pdf-lib';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  let tempPdfPath = '';
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    const pdfFile = files[0];
    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    tempPdfPath = path.join(tmpdir(), `upload-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempPdfPath, buffer);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

    await browser.close();

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"><title>PDF to HTML</title></head>
        <body>
          ${htmlPages.join('\n<hr style="margin: 2rem 0;" />')}
        </body>
      </html>
    `;

    return new NextResponse(fullHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="converted.html"',
      },
    });
  } catch (err: any) {
    console.error("PDF to HTML error:", err);
    return NextResponse.json({ error: err.message || "Conversion failed" }, { status: 500 });
  } finally {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
    }
  }
}
