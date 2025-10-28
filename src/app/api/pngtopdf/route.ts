import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  let tempPdfPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files?.length)
      return NextResponse.json({ error: "No PNG file uploaded" }, { status: 400 });

    // ✅ Build inline HTML with base64 PNGs
    const imagesHtml = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        return `<div style="page-break-after: always; text-align:center; margin-top:2rem;">
                  <img src="data:${file.type};base64,${base64}" style="max-width:100%; height:auto;" />
                </div>`;
      })
    );

    const html = `
      <html>
        <body style="margin:1rem; font-family:sans-serif; text-align:center;">
          ${imagesHtml.join("\n")}
        </body>
      </html>
    `;

    // ✅ Use chromium for Vercel/serverless
    const executablePath = await chromium.executablePath();

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath || undefined,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    tempPdfPath = path.join(tmpdir(), `png-${Date.now()}.pdf`);
    await page.pdf({ path: tempPdfPath, format: "A4", printBackground: true });
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
    console.error("PNG → PDF failed:", error);
    return NextResponse.json({ error: `Conversion failed: ${error.message}` }, { status: 500 });
  } finally {
    try {
      if (tempPdfPath && fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
    } catch {}
  }
}
