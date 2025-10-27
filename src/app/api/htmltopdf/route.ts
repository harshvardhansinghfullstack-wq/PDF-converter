import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No HTML file uploaded" }),
        { status: 400 }
      );
    }

    const htmlFile = files[0];
    const arrayBuffer = await htmlFile.arrayBuffer();
    const htmlContent = new TextDecoder().decode(arrayBuffer);

    // Launch Puppeteer to convert HTML to PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Correct way to slice the buffer
    const slicedBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    ) as ArrayBuffer;

    return new NextResponse(slicedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="converted.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error during HTML to PDF conversion:", error);
    return new NextResponse(
      JSON.stringify({ error: `Conversion failed: ${error.message}` }),
      { status: 500 }
    );
  }
}
