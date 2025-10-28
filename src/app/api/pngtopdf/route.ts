import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

let puppeteer: any;
let chromium: any;

// ✅ Load correct puppeteer version depending on environment
try {
  chromium = await import("@sparticuz/chromium");
  puppeteer = await import("puppeteer-core");
} catch {
  puppeteer = await import("puppeteer");
}

export async function POST(req: NextRequest) {
  let tempPdfPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No PNG files uploaded" }, { status: 400 });
    }

    // ✅ Validate PNG files
    for (const file of files) {
      if (!file.type.includes("png")) {
        return NextResponse.json({ error: "Only PNG files are supported" }, { status: 400 });
      }
    }

    // ✅ Create HTML content with all PNGs
    const imagesHtml = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return `
          <div style="page-break-after: always; text-align:center; margin: 2rem 0;">
            <img src="data:${file.type};base64,${base64}" style="max-width:100%; height:auto;" />
          </div>`;
      })
    );

    const html = `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; text-align: center; }
            img { max-width: 100%; height: auto; display: block; margin: auto; }
          </style>
        </head>
        <body>${imagesHtml.join("\n")}</body>
      </html>
    `;

    // ✅ Auto-detect environment
    const isLocal = !process.env.AWS_REGION && !process.env.VERCEL;
    let browser;

    if (isLocal) {
      // 🧩 Local Dev
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // ☁️ Production (Vercel/AWS)
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    tempPdfPath = path.join(tmpdir(), `pngtopdf-${Date.now()}.pdf`);
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
    console.error("❌ PNG → PDF Conversion Failed:", error);
    return NextResponse.json(
      { error: `Conversion failed: ${error.message}` },
      { status: 500 }
    );
  } finally {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      try {
        await fs.promises.unlink(tempPdfPath);
      } catch {}
    }
  }
}
