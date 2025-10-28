import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let tempPdfPath = "";

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files?.length) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const pdfFile = files[0];
    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    // Save temp file
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    tempPdfPath = path.join(tmpdir(), `upload-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempPdfPath, buffer);

    // Extract text using pdf-parse
    const data = await pdfParse(buffer);

    // Create simple HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>${pdfFile.name}</title>
        <style>
          body { font-family: sans-serif; background: #f9f9f9; padding: 20px; line-height: 1.6; }
          pre { background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 0 4px rgba(0,0,0,0.1); }
        </style>
      </head>
      <body>
        <h2>${pdfFile.name}</h2>
        <pre>${data.text}</pre>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${pdfFile.name.replace(".pdf", ".html")}"`,
      },
    });
  } catch (err: any) {
    console.error("PDF → HTML conversion error:", err);
    return NextResponse.json({ error: err.message || "Conversion failed" }, { status: 500 });
  } finally {
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      await fs.promises.unlink(tempPdfPath).catch(() => {});
    }
  }
}
