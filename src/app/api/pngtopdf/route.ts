import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  let tempPdfPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No PNG file uploaded" }),
        { status: 400 }
      );
    }

    // Validate files are PNG
    for (const file of files) {
      if (!file.type.includes("png")) {
        return new NextResponse(
          JSON.stringify({ error: "Only PNG files are supported" }),
          { status: 400 }
        );
      }
    }

    // Prepare HTML content with each PNG as an <img> inside a div with page-break
    const imagesHtml = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type; // should be image/png
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
    tempPdfPath = path.join(tmpdir(), `png-${Date.now()}.pdf`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: tempPdfPath, format: "A4" });
    await browser.close();

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Error during PNG to PDF conversion:", error);
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
      console.error("Error cleaning up PDF temp file:", cleanupError);
    }
  }
}
