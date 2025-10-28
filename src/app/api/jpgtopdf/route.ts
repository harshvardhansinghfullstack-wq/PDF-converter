import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

// Dynamic imports so they don’t conflict in edge/runtime
let puppeteer: any;
let chromium: any;

export async function POST(req: NextRequest) {
  let tempPdfPath = "";
  let browser = null;

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No JPG file uploaded" }, { status: 400 });
    }

    // Validate all files are JPEG
    for (const file of files) {
      if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
        return NextResponse.json({ error: "Only JPG files are supported" }, { status: 400 });
      }
    }

    // Convert uploaded files to base64 <img> elements
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

    // ✅ Detect environment: local or production
    const isLocal = process.env.NODE_ENV === "development";

    if (isLocal) {
      // 🧩 Local mode — use normal Puppeteer with its bundled Chromium
      const pkg = await import("puppeteer");
      puppeteer = pkg.default;
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // ☁️ Production mode — lightweight puppeteer-core + sparticuz/chromium
      const chrom = await import("@sparticuz/chromium");
      const core = await import("puppeteer-core");
      chromium = chrom.default;
      puppeteer = core.default;

      const executablePath = await chromium.executablePath();

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    }

    // Generate PDF
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: tempPdfPath, format: "A4", printBackground: true });

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);
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
    console.error("Error during JPG → PDF conversion:", error);
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
      console.error("Error cleaning up temp PDF file:", cleanupError);
    }
  }
}
