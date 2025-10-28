import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

export async function POST(req: NextRequest) {
  let tempPdfPath = "";

  try {
    // 🧠 Dynamically import puppeteer when needed
    let puppeteer: any;
    let chromium: any;

    try {
      chromium = await import("@sparticuz/chromium");
      puppeteer = await import("puppeteer-core");
    } catch {
      puppeteer = await import("puppeteer");
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No Excel file uploaded" }), { status: 400 });
    }

    const excelFile = files[0];
    const arrayBuffer = await excelFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Read Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

    // ✅ Convert to HTML
    const htmlTableRows = data
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}</tr>`
      )
      .join("");

    const html = `
      <html>
        <head>
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            th { background-color: #4CAF50; color: white; }
          </style>
        </head>
        <body>
          <h2>${sheetName}</h2>
          <table>${htmlTableRows}</table>
        </body>
      </html>
    `;

    // ✅ Setup paths
    tempPdfPath = path.join(tmpdir(), `excel-${Date.now()}.pdf`);

    // ✅ Launch Puppeteer
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
    console.error("Excel→PDF error:", error);
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
      console.error("Error cleaning up temp file:", cleanupError);
    }
  }
}
