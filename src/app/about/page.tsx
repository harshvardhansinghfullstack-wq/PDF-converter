"use client";
import React from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const AboutPage = () => {
  return (
    <div style={{ margin: "0 auto", fontFamily: "sans-serif" }}>
      <Navbar />

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            marginBottom: "1rem",
            color: "#222",
          }}
        >
          Why Choose FileMint.com
        </h1>
        <h3
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            color: "#444",
            marginBottom: "1.5rem",
          }}
        >
          Fast, Secure & User-Friendly File Conversion
        </h3>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "#555",
            lineHeight: 1.6,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Our platform empowers users to convert, compress, and manage documents
          quickly and easily — with zero learning curve. Whether you're merging
          PDFs, converting Word files, or compressing media, FileMint delivers
          with speed and precision.
        </p>

        {/* Features Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginTop: "3rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#FEC18C",
              padding: "1.5rem",
              borderRadius: "1rem",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Smart Conversion Tools
            </h2>
            <p style={{ lineHeight: 1.5, color: "#333" }}>
              Convert PDFs, images, Word docs, and more using powerful and
              secure algorithms — no formatting loss, no hassle.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#A4F7D2",
              padding: "1.5rem",
              borderRadius: "1rem",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Privacy First
            </h2>
            <p style={{ lineHeight: 1.5, color: "#333" }}>
              We don't store your files. All uploads are encrypted and
              auto-deleted within hours. Your data stays yours — always.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#C6D8FE",
              padding: "1.5rem",
              borderRadius: "1rem",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Built for Everyone
            </h2>
            <p style={{ lineHeight: 1.5, color: "#333" }}>
              From students to professionals, FileMint is designed for
              streamlined workflows. Convert exams, merge invoices, or make
              scanned images editable — all in one place.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#F1CCF7",
              padding: "1.5rem",
              borderRadius: "1rem",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Cloud-Ready
            </h2>
            <p style={{ lineHeight: 1.5, color: "#333" }}>
              Seamlessly import and export from Google Drive, Dropbox, or
              OneDrive — no more downloads or reuploads.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "white",
          padding: "2rem 1rem",
          borderTop: "1px solid #e5e7eb",
          marginTop: "3rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Logo */}
          <Link href="/">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: "30px", cursor: "pointer" }}
            />
          </Link>

          {/* Footer Nav */}
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              fontSize: "0.95rem",
            }}
          >
            <Link href="/about" style={{ color: "#666", textDecoration: "none" }}>
              About
            </Link>
            <Link href="/blog" style={{ color: "#666", textDecoration: "none" }}>
              Blog Posts
            </Link>
            <Link href="/faq" style={{ color: "#666", textDecoration: "none" }}>
              FAQ
            </Link>
            <Link href="/terms" style={{ color: "#666", textDecoration: "none" }}>
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              style={{ color: "#666", textDecoration: "none" }}
            >
              Privacy Policy
            </Link>
          </nav>

          <p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "1rem" }}>
            © {new Date().getFullYear()} FileMint.com — All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
