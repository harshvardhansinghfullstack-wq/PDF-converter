import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import mammoth from "mammoth";

export const runtime = "nodejs"; // ✅ ensures Node.js runtime on Vercel

export async function POST(req: NextRequest) {
  let tempDocxPath = "";
  let tempPdfPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const docxFile = files[0];
    const buffer = Buffer.from(await docxFile.arrayBuffer());
    tempDocxPath = path.join(tmpdir(), `input-${Date.now()}.docx`);
    tempPdfPath = path.join(tmpdir(), `output-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempDocxPath, buffer);

    // Convert DOCX → HTML
    const htmlResult = await mammoth.convertToHtml({ path: tempDocxPath });
    const html = htmlResult.value;

    // ✅ Detect local vs deployed
    const isLocal = process.env.NODE_ENV === "development";

    // ✅ Correct browser launch for both environments
    const browser = await puppeteer.launch(
      isLocal
        ? {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            executablePath:
              process.platform === "win32"
                ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
                : "/usr/bin/google-chrome",
          }
        : {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }
    );

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (err: any) {
    console.error("❌ DOCX→PDF conversion error:", err);
    return NextResponse.json(
      {
        error: `Failed to convert DOCX to PDF: ${err.message}`,
      },
      { status: 500 }
    );
  } finally {
    try {
      if (tempDocxPath && fs.existsSync(tempDocxPath))
        await fs.promises.unlink(tempDocxPath);
      if (tempPdfPath && fs.existsSync(tempPdfPath))
        await fs.promises.unlink(tempPdfPath);
    } catch (cleanupErr) {
      console.warn("⚠️ Cleanup error:", cleanupErr);
    }
  }
}
