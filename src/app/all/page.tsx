// src/app/all/page.tsx
"use client";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useState } from "react";
// Define your tool data
const pdfOperations = [
  {
    title: "Merge PDF",
    description:
      "Combine multiple PDF files into one organized document in seconds — fast, simple, and secure.",
    route: "/mergepdf",
  },
  {
    title: "Split PDF",
    description: "Separate PDF pages into individual files.",
    route: "/splitpdf",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF file size quickly without compromising quality.",
    route: "/compresspdf",
  },
  {
    title: "Edit PDF",
    description:
      "Modify text and images in your PDF as easily as in a word processor.",
    route: "/editpdf",
  },
  {
    title: "eSign PDF",
    description: "Sign PDFs electronically, track status, and store securely.",
    route: "/esignpdf",
  },
  {
    title: "Rotate PDF",
    description: "Rotate one or more PDF pages.",
    route: "/rotatepdf",
  },
  {
    title: "Delete PDF Pages",
    description: "Remove unwanted pages from your PDF.",
    route: "/deletepdfpages",
  },
  {
    title: "Rearrange PDF",
    description: "Drag-and-drop pages to reorder your PDF.",
    route: "/reorderpdf",
  },
];

const convertToPDF = [
  {
    title: "Word to PDF",
    description:
      "Convert Word documents into PDF while preserving formatting and layout.",
    route: "/wordtopdf",
  },
  {
    title: "Excel to PDF",
    description:
      "Turn spreadsheets into clean, printable PDFs. Keeps your tables, charts, and formulas intact.",
    route: "/exceltopdf",
  },
  {
    title: "PowerPoint to PDF",
    description:
      "Convert slides into a portable PDF format. Perfect for sharing presentations without losing design.",
    route: "/ppttopdf",
  },
  {
    title: "JPG to PDF",
    description:
      "Merge one or more JPG images into a single PDF. Great for creating photo albums or documents.",
    route: "/jpgtopdf",
  },
  {
    title: "PNG to PDF",
    description: "Merge PNG images into a PDF document quickly.",
    route: "/pngtopdf",
  },
  {
    title: "TIFF to PDF",
    description: "Convert TIFF files to PDF with high fidelity.",
    route: "/tifftopdf",
  },
  {
    title: "HTML to PDF",
    description: "Convert web pages (HTML) into PDF files.",
    route: "/htmltopdf",
  },
  {
    title: "Scan to PDF",
    description: "Turn scanned images into searchable PDFs.",
    route: "/scantopdf",
  },
  // {
  //   title: "CAD to PDF",
  //   description: "Convert CAD drawings into PDF for easy sharing.",
  //   route: "/cadtops",
  // },
  // {
  //   title: "Any File to PDF",
  //   description: "Universal converter—turn almost any document into PDF.",
  //   route: "/anytopdf",
  // },
];

const convertFromPDF = [
  {
    title: "PDF to Word",
    description: "Extract text and formatting from PDF to Word.",
    route: "/pdftoword",
  },
  {
    title: "PDF to Excel",
    description: "Export tables and data from PDF to Excel.",
    route: "/pdftoexcel",
  },
  {
    title: "PDF to PowerPoint",
    description: "Turn your PDF slides back into PowerPoint files.",
    route: "/pdftoppt",
  },
  {
    title: "PDF to JPG",
    description: "Export PDF pages as high-quality JPG images.",
    route: "/pdftojpg",
  },
  {
    title: "PDF to PNG",
    description: "Export PDF pages as PNG images.",
    route: "/pdftopng",
  },
  {
    title: "PDF to Text",
    description: "Extract plain text from your PDF.",
    route: "/pdftotext",
  },
  {
    title: "PDF to HTML",
    description: "Convert PDF into web-ready HTML.",
    route: "/pdftohtml",
  },
  // {
  //   title: "PDF to AutoCAD",
  //   description: "Convert PDFs back to DWG/DXF for editing in AutoCAD.",
  //   route: "/pdftocad",
  // },
  {
    title: "PDF to Markdown",
    description: "Extract Markdown-friendly text from your PDF.",
    route: "/pdftomarkdown",
  },
  {
    title: "PDF to ePub",
    description: "Turn your PDF into an ePub ebook.",
    route: "/pdftoepub",
  },
  {
    title: "PDF to XML",
    description: "Export PDF content as XML.",
    route: "/pdftoxml",
  },
  // {
  //   title: "PDF to Any Image",
  //   description: "Convert PDF pages into any image format.",
  //   route: "/pdftoimage",
  // },
];

const advancedTools = [
  {
    title: "Batch Processing",
    description: "Apply actions to multiple PDFs in one go.",
    route: "/batch",
  },
  {
    title: "Compare PDFs",
    description: "Visually compare two PDFs and highlight differences.",
    route: "/comparepdf",
  },
  // {
  //   title: "Optimize PDF (Web/Print)",
  //   description: "Optimize for fast web viewing or high-res printing.",
  //   route: "/optimizepdf",
  // },
  {
    title: "Add Watermark & Remove",
    description: "Stamp or remove watermarks from your PDFs.",
    route: "/watermark",
  },
  {
    title: "OCR PDF → AI",
    description: "Make scanned PDFs searchable with OCR powered by AI.",
    route: "/ocr",
  },
  // {
  //   title: "API & Upload",
  //   description: "Integrate our tools into your own apps via API.",
  //   route: "/api",
  // },
];

const premiumTools = [
  {
    title: "All PDF Summarizer",
    description: "AI summaries of any PDF document.",
    route: "/summarizer",
  },
  {
    title: "PDF Language Converter",
    description: "Translate your PDF into 100+ languages.",
    route: "/translate",
  },
  {
    title: "All Questions Generator",
    description: "Generate quiz questions from your PDF.",
    route: "/quiz",
  },
  // {
  //   title: "Bulk Upload",
  //   description: "Upload and process hundreds of PDFs at once.",
  //   route: "/bulk-upload",
  // },
];

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Header */}
        <h1 style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>
          All-in-One PDF Toolkit
        </h1>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Easily manage your PDFs with our quick and reliable tools — split,
          merge, edit, or convert in just a few clicks.
        </p>

        {/* Search & Categories */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
   <input
     type="search"
     placeholder="Search tools…"
    // ✅ ADD THESE TWO LINES
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
    // 
     style={{
       flex: 1,
       padding: ".75rem 1rem",
       borderRadius: "6px",
       border: "1px solid #ccc",
       fontSize: "1rem",
     }}
   />
   <button
     style={{
       padding: ".75rem 1.5rem",
       backgroundColor: "#0066FF",
       color: "#fff",
       border: "none",
       borderRadius: "6px",
       cursor: "pointer",
       fontSize: "1rem",
     }}
   >
     Categories
   </button>
</div>

        {/* Section generator */}
        {[
          { title: "PDF Operations", items: pdfOperations },
          { title: "Convert to PDF", items: convertToPDF },
          { title: "Convert from PDF", items: convertFromPDF },
          { title: "Advanced & Specialized Tools", items: advancedTools },
          { title: "Premium", items: premiumTools },
        ].map((section, idx) => (
          <section key={idx} style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".8rem" }}>
              {section.title}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: "1rem",
              }}
            >
             {section.items
  .filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .map((tool, i) => (
    <Link
      key={i}
      href={tool.route}
      style={{
        display: "block",
        padding: "1rem",
        background:
          section.title === "PDF Operations"
            ? "#E6F4EA"
            : section.title === "Convert to PDF"
            ? "#FFF2E6"
            : section.title === "Convert from PDF"
            ? "#F3E6FF"
            : section.title === "Advanced & Specialized Tools"
            ? "#F0F0F0"
            : "#E6F0FF",
        borderRadius: "6px",
        textDecoration: "none",
        color: "#222",
        fontSize: ".95rem",
      }}
    >
      <strong>{tool.title}</strong>
      <p style={{ marginTop: ".5rem", lineHeight: 1.3 }}>
        {tool.description}
      </p>
    </Link>
  ))}

            </div>
          </section>
        ))}
        {/* Footer */}
      <footer
        style={{
          backgroundColor: "white",
          padding: "2rem 0",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            {/* Logo */}
            <div style={{ position: "absolute", left: "2rem" }}>
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="Logo"
                  style={{ height: "20px", cursor: "pointer" }}
                />
              </Link>
            </div>

{/* Navigation */}
         <nav style={{ display: "flex", gap: "2rem", fontSize: "0.9rem" }}>
  <Link href="/about" style={{ color: "#666", textDecoration: "none" }}>
    About
  </Link>
  <Link href="/blogs" style={{ color: "#666", textDecoration: "none" }}>
    Blog Posts
  </Link>
  <Link href="/faq" style={{ color: "#666", textDecoration: "none" }}>
    FAQ
  </Link>
  <Link href="/terms" style={{ color: "#666", textDecoration: "none" }}>
    Terms & Conditions
  </Link>
  <Link href="/privacy-policy" style={{ color: "#666", textDecoration: "none" }}>
    Privacy Policy
  </Link>
</nav>




            {/* Social Icons */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="#" style={{ color: "#666", fontSize: "1.2rem" }}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" style={{ color: "#666", fontSize: "1.2rem" }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ color: "#666", fontSize: "1.2rem" }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={{ color: "#666", fontSize: "1.2rem" }}>
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
