import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { tmpdir } from 'os';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  let tempPdfPath = '';

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'No JPG file uploaded' }),
        { status: 400 }
      );
    }

    // Validate file types
    for (const file of files) {
      if (!file.type.startsWith('image/jpeg')) {
        return new NextResponse(
          JSON.stringify({ error: 'Only JPG files are supported' }),
          { status: 400 }
        );
      }
    }

    // Convert uploaded files to base64 data URLs to embed in HTML
    const imagesHtml = await Promise.all(
      files.map(async (file, i) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        // Use CSS to fit image nicely on PDF page
        return `<div style="page-break-after: always; text-align: center;">
                  <img src="data:image/jpeg;base64,${base64}" style="max-width: 100%; max-height: 100vh;" />
                </div>`;
      })
    );

    const html = `
      <html>
        <head>
          <style>
            @page { margin: 0; }
            body { margin: 0; padding: 0; }
            img { display: block; margin: auto; }
          </style>
        </head>
        <body>
          ${imagesHtml.join('')}
        </body>
      </html>
    `;

    tempPdfPath = path.join(tmpdir(), `jpgtopdf-${Date.now()}.pdf`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: tempPdfPath, format: 'A4', printBackground: true });
    await browser.close();

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error during JPG to PDF conversion:', error);
    return new NextResponse(
      JSON.stringify({ error: `Conversion failed: ${error.message}` }),
      { status: 500 }
    );
  } finally {
    try {
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temp PDF file:', cleanupError);
    }
  }
}
