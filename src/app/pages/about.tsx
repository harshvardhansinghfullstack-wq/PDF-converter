// /pages/about.tsx

import React from 'react';
import Link from 'next/link';

const About = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <header>
        <h1>Why Choose FileMint.com</h1>
        <p>Fast, Secure & User-Friendly File Conversion</p>
      </header>
      <section>
        <h2>Smart Conversion Tools</h2>
        <p>Convert PDFs, images, Word docs, and more using powerful and secure algorithms.</p>
      </section>
      <section>
        <h2>Privacy First</h2>
        <p>Your data stays secure—always. All uploads are encrypted and auto-deleted within hours.</p>
      </section>
      <section>
        <h2>Built for Everyone</h2>
        <p>From students to professionals, FileMint is designed for streamlined workflows.</p>
      </section>
      <section>
        <h2>Cloud-Ready</h2>
        <p>Seamlessly import and export from Google Drive, Dropbox, or OneDrive.</p>
      </section>

      <footer style={{ marginTop: '2rem' }}>
        <Link href="/">Go back to Home</Link>
      </footer>
    </div>
  );
};

export default About;
