// src/app/api/wordtopdf/route.ts
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import { tmpdir } from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  let tempFilePath = "";
  let tempPdfPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No files provided" }),
        { status: 400 }
      );
    }

    const docxFile = files[0];
    const arrayBuffer = await docxFile.arrayBuffer();
    const docxBuffer = Buffer.from(arrayBuffer);

    tempFilePath = path.join(tmpdir(), `docx-${Date.now()}.docx`);
    tempPdfPath = path.join(tmpdir(), `pdf-${Date.now()}.pdf`);

    await fs.promises.writeFile(tempFilePath, docxBuffer);

    const htmlContent = await mammoth.convertToHtml({ path: tempFilePath });
    const html = htmlContent.value;

    // ✅ FIX: Launch Puppeteer with portable Chromium for serverless environments
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        (await chromium.executablePath()) || "/usr/bin/chromium-browser",
      headless: chromium.headless,
    });

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
  } catch (error: any) {
    console.error("Error during DOCX to PDF conversion:", error);
    return new NextResponse(
      JSON.stringify({
        error: `An error occurred during file upload or conversion: ${error.message}`,
      }),
      { status: 500 }
    );
  } finally {
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
  }
}
