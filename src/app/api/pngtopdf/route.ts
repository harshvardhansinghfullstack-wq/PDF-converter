import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import fs from "fs";
import path from "path";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  let tempPdfPath = "";
  let browser = null;

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No PNG file uploaded" },
        { status: 400 }
      );
    }

    // Validate files are PNG
    for (const file of files) {
      if (!file.type.includes("png")) {
        return NextResponse.json(
          { error: "Only PNG files are supported" },
          { status: 400 }
        );
      }
    }

    // Prepare HTML content
    const imagesHtml = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type;
        return `<div style="page-break-after: always; text-align:center; margin-top: 2rem;">
                  <img src="data:${mimeType};base64,${base64}" style="max-width: 100%; height: auto;" />
                </div>`;
      })
    );

    const html = `
      <html>
        <head>
          <style>
            @media print {
              div { page-break-after: always; }
            }
            body {
              margin: 1rem;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            img {
              max-width: 100%;
              height: auto;
              margin: auto;
              display: block;
            }
          </style>
        </head>
        <body>
          ${imagesHtml.join("\n")}
        </body>
      </html>
    `;

    // Generate PDF
    tempPdfPath = path.join(tmpdir(), `png-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
    
    // Launch browser with chromium
    browser = await puppeteerCore.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: tempPdfPath, format: "A4" });

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);

    // Get first file name for output filename
    const firstFileName = files[0].name.replace(/\.[^/.]+$/, "");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${firstFileName}-converted.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error during PNG to PDF conversion:", error);
    return NextResponse.json(
      { error: `Conversion failed: ${error.message}` },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error("Error closing browser:", e);
      }
    }
    try {
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up PDF temp file:", cleanupError);
    }
  }
}