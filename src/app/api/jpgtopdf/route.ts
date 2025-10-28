import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

let chromium: any;
let puppeteer: any;

try {
  // 🟢 Load optimized Chromium for serverless environments
  const chromiumImport = await import("@sparticuz/chromium");
  chromium = chromiumImport.default || chromiumImport;
  puppeteer = (await import("puppeteer-core")).default;
} catch {
  // 🟡 Fallback for local dev
  puppeteer = (await import("puppeteer")).default;
}

export async function POST(req: NextRequest) {
  let tempPdfPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No JPG file uploaded" }, { status: 400 });
    }

    // ✅ Validate all files are JPEG
    for (const file of files) {
      if (!file.type.startsWith("image/jpeg")) {
        return NextResponse.json({ error: "Only JPG files are supported" }, { status: 400 });
      }
    }

    // ✅ Convert uploaded files to base64 <img> elements
    const imagesHtml = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return `
          <div style="page-break-after: always; text-align: center;">
            <img src="data:image/jpeg;base64,${base64}"
                 style="max-width: 100%; max-height: 100vh; display: block; margin: auto;" />
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
        <body>${imagesHtml.join("")}</body>
      </html>
    `;

    tempPdfPath = path.join(tmpdir(), `jpgtopdf-${Date.now()}.pdf`);

    // 🧠 Launch Puppeteer correctly for both local & production
    const browser = await puppeteer.launch(
      chromium && chromium.executablePath
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
    await page.setContent(html, { waitUntil: "networkidle0" });
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
    console.error("Error during JPG → PDF conversion:", error);
    return NextResponse.json(
      { error: `Conversion failed: ${error.message}` },
      { status: 500 }
    );
  } finally {
    try {
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temp PDF file:", cleanupError);
    }
  }
}
