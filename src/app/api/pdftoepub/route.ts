import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import JSZip from "jszip";
import { create } from "xmlbuilder2";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const pdfFile = files[0];
    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    // Convert File → Buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const pdfData = await pdfParse(buffer);
    const plainText = pdfData.text?.trim();

    if (!plainText) {
      return NextResponse.json(
        { error: "No extractable text found in PDF." },
        { status: 400 }
      );
    }

    // Split into logical chapters
    const chapters = plainText
      .split(/\f+|\n\s*\n\s*\n+/g)
      .filter((t) => t.trim().length > 50)
      .map((t, i) => ({
        title: `Chapter ${i + 1}`,
        content: `<h2>Chapter ${i + 1}</h2><p>${t
          .trim()
          .replace(/\n+/g, "</p><p>")}</p>`,
      }));

    if (!chapters.length) {
      return NextResponse.json(
        { error: "Could not extract meaningful content." },
        { status: 400 }
      );
    }

    // --- Build EPUB structure manually using JSZip ---
    const zip = new JSZip();

    // 1️⃣  mimetype file (must be first, no compression)
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

    // 2️⃣  META-INF/container.xml
    zip.file(
      "META-INF/container.xml",
      `<?xml version="1.0"?>
       <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
         <rootfiles>
           <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
         </rootfiles>
       </container>`
    );

    // 3️⃣  Create content XHTML files
    chapters.forEach((ch, i) => {
      zip.file(
        `OEBPS/chapter${i + 1}.xhtml`,
        `<?xml version="1.0" encoding="utf-8"?>
         <html xmlns="http://www.w3.org/1999/xhtml">
         <head><title>${ch.title}</title></head>
         <body>${ch.content}</body></html>`
      );
    });

    // 4️⃣  content.opf (manifest + spine)
    const manifestItems = chapters
      .map(
        (ch, i) =>
          `<item id="chap${i + 1}" href="chapter${i + 1}.xhtml" media-type="application/xhtml+xml"/>`
      )
      .join("\n");

    const spineItems = chapters
      .map((_, i) => `<itemref idref="chap${i + 1}"/>`)
      .join("\n");

    zip.file(
      "OEBPS/content.opf",
      `<?xml version="1.0" encoding="UTF-8"?>
       <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
         <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
           <dc:title>${pdfFile.name.replace(".pdf", "")}</dc:title>
           <dc:language>en</dc:language>
           <dc:identifier id="BookId">urn:uuid:${crypto.randomUUID()}</dc:identifier>
         </metadata>
         <manifest>
           ${manifestItems}
         </manifest>
         <spine>
           ${spineItems}
         </spine>
       </package>`
    );

    // 5️⃣  toc.ncx (navigation)
    const ncxNavPoints = chapters
      .map(
        (ch, i) => `
        <navPoint id="navPoint-${i + 1}" playOrder="${i + 1}">
          <navLabel><text>${ch.title}</text></navLabel>
          <content src="chapter${i + 1}.xhtml"/>
        </navPoint>`
      )
      .join("\n");

    zip.file(
      "OEBPS/toc.ncx",
      `<?xml version="1.0" encoding="UTF-8"?>
       <!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN"
        "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
       <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
         <head><meta name="dtb:uid" content="${crypto.randomUUID()}"/></head>
         <docTitle><text>${pdfFile.name.replace(".pdf", "")}</text></docTitle>
         <navMap>${ncxNavPoints}</navMap>
       </ncx>`
    );

    // Generate EPUB as buffer
    const epubBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(epubBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/epub+zip",
        "Content-Disposition": `attachment; filename="${pdfFile.name.replace(
          /\.pdf$/i,
          ".epub"
        )}"`,
      },
    });
  } catch (err: any) {
    console.error("EPUB conversion failed:", err);
    return NextResponse.json(
      {
        error: `EPUB conversion failed: ${err.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
