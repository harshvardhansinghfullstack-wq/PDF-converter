import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  let tempPdfPath = "";
  let browser = null;

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No HTML file uploaded" }, { status: 400 });
    }

    const htmlFile = files[0];

    if (!htmlFile.type.includes("html") && !htmlFile.name.endsWith(".html")) {
      return NextResponse.json({ error: "Only HTML files are supported" }, { status: 400 });
    }

    const arrayBuffer = await htmlFile.arrayBuffer();
    const htmlContent = new TextDecoder().decode(arrayBuffer);

    tempPdfPath = path.join(tmpdir(), `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);

    // Launch browser with chromium
    browser = await puppeteerCore.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: tempPdfPath, format: "A4" });

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${htmlFile.name.replace('.html', '.pdf')}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error during HTML→PDF conversion:", error);
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
      console.error("Error cleaning up temp file:", cleanupError);
    }
  }
}