import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import { diffWords } from "diff";
import os from "os";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function extractTextFromPdf(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  const parsed = await pdfParse(data);
  return parsed.text;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const uploadDir = path.join(os.tmpdir(), "pdf-compare");
  await fs.mkdir(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20MB limit
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).send("Error parsing files.");
    }

    try {
      const fileA = files.fileA as formidable.File;
      const fileB = files.fileB as formidable.File;

      const textA = await extractTextFromPdf(fileA.filepath);
      const textB = await extractTextFromPdf(fileB.filepath);

      const differences = diffWords(textA, textB);
      const diffHtml = differences
        .map((part) => {
          const color = part.added ? "green" : part.removed ? "red" : "inherit";
          const tag = part.added || part.removed ? "mark" : "span";
          return `<${tag} style="color:${color}">${part.value}</${tag}>`;
        })
        .join("");

      // cleanup safely
      await fs.unlink(fileA.filepath);
      await fs.unlink(fileB.filepath);

      res.status(200).json({ diffHtml });
    } catch (error) {
      console.error("Comparison error:", error);
      res.status(500).send("Comparison failed.");
    }
  });
}
