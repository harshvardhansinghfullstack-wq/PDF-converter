import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

let chromium: any;
let puppeteer: any;

try {
  // ✅ For serverless / Vercel
  chromium = await import("@sparticuz/chromium");
  puppeteer = await import("puppeteer-core");
} catch {
  // ✅ For local development
  puppeteer = await import("puppeteer");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No HTML file uploaded" }), {
        status: 400,
      });
    }

    const htmlFile = files[0];
    const arrayBuffer = await htmlFile.arrayBuffer();
    const htmlContent = new TextDecoder().decode(arrayBuffer);

    // 🧠 Create a temporary output path (optional)
    const tempPdfPath = path.join(tmpdir(), `html-${Date.now()}.pdf`);

    // 🦾 Launch Puppeteer safely for all environments
    const browser = await puppeteer.launch(
      chromium
        ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }
        : {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          }
    );

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ path: tempPdfPath, format: "A4" });
    await browser.close();

    const buffer = await fs.promises.readFile(tempPdfPath);
    await fs.promises.unlink(tempPdfPath).catch(() => {});

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="converted.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error during HTML→PDF conversion:", error);
    return new NextResponse(
      JSON.stringify({
        error: `Conversion failed: ${error.message}`,
      }),
      { status: 500 }
    );
  }
}
