import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { diffWords } from "diff";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function extractTextFromPdf(path: string): Promise<string> {
  const data = fs.readFileSync(path);
  const parsed = await pdfParse(data);
  return parsed.text;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const form = new formidable.IncomingForm({
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Form parsing error");

    try {
      const fileA = files.fileA as unknown as formidable.File;
      const fileB = files.fileB as unknown as formidable.File;

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

      // Cleanup
      fs.unlinkSync(fileA.filepath);
      fs.unlinkSync(fileB.filepath);

      res.status(200).json({ diffHtml });
    } catch (error) {
      console.error("Compare error:", error);
      res.status(500).send("Comparison failed.");
    }
  });
}
