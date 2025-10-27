'use client'
// C:\Users\khush\OneDrive\Documents\Desktop\file\code1\FileMint\src\app\components\HomePage.tsx
import Link from "next/link";
import AdBanner from "./AdBanner";
import BGSvgComponent from "./BG";


export default function HomePage() {
  
  return (
    <>
      <AdBanner />
      {/* Hero Section */}
     <main
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "90vh",
    gap: 0,
    flexWrap: "wrap",
    position: "relative", // needed for mobile background
  }}
>
  {/* Text Section */}
  <div
    style={{
      flex: "1",
      textAlign: "center",
      paddingRight: "0",
      marginLeft: "6vw",
    }}
  >
    <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>
      Effortlessly Convert
      <br />
      Your Files in Seconds
    </h1>
    <p style={{ fontSize: "1.2rem" }}>
      Transform your documents with our easy-to-use file conversion tools.
    </p>
    <p style={{ fontSize: "1.2rem" }}>
      Upload, convert, and download in just a few clicks!
    </p>

    <div className="hero-buttons">
      <button className="primary-btn">Convert Now</button>
      <button className="secondary-btn">Learn More</button>
    </div>
  </div>

  {/* Image Section */}
  <div
    style={{ flex: "1", display: "flex", justifyContent: "flex-start" }}
  ><BGSvgComponent style={{
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        objectFit: "cover",
      }}/>
    {/* <img
      src="/BG.png"
      alt="Illustration"
      
    /> */}
  </div>

  <style jsx>{`
    .hero-buttons {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .primary-btn {
      padding: 1.25rem 3rem;
      background: linear-gradient(103deg, #0E1C29 -19.6%, #323D68 129.35%);
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      box-shadow:
        0 5px 12px 0 rgba(46, 64, 128, 0.25),
        0 4px 4px 0 rgba(184, 193, 230, 0.35) inset;
      transition: all 0.3s ease;
    }

    .primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    }

    .secondary-btn {
      padding: 1.25rem 3rem;
      background: white;
      color: #0070f3;
      font-size: 1.1rem;
      font-weight: 600;
      border: 2px solid #0070f3;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .secondary-btn:hover {
      background-color: #0070f3;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      main {
        flex-direction: column;
      }

      main img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0;
        z-index: -1;
        opacity: 0.3; /* subtle background */
      }

      .hero-buttons {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }

      .primary-btn,
      .secondary-btn {
        width: 80%;
        max-width: 300px;
      }

      div[style*="textAlign: center"] {
        text-align: center;
        padding: 2rem;
        color: white; /* make text visible over image */
      }
    }
  `}</style>
</main>


     {/* Popular Tools Section */}
<section style={{ padding: "0" }}>
  <h2
    style={{
      fontSize: "3rem",
      marginBottom: "2rem",
      textAlign: "center",
    }}
  >
    Popular Tools
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1.5rem",
      maxWidth: "600px",
      margin: "0 auto",
      justifyItems: "center",
    }}
  >
    {[
      {
        title: "PDF to Word",
        icon: "fa-regular fa-file-word",
        color: "#E8D5FF",
        route: "/pdftoword",
      },
      {
        title: "Merge PDF",
        icon: "fas fa-upload",
        color: "#D5F5D5",
        route: "/mergepdf",
      },
      {
        title: "Edit PDF",
        icon: "fa-regular fa-edit",
        color: "#FFE5D5",
        route: "/editpdf",
      },
      {
        title: "eSign PDF",
        icon: "fas fa-file-signature",
        color: "#F0D5FF",
        route: "/esignpdf",
      },
      {
        title: "Compare PDF",
        icon: "fas fa-columns",
        color: "#D5E5FF",
        route: "/comparepdf",
      },
      {
        title: "Word to PDF",
        icon: "fas fa-file-pdf",
        color: "#E5F0FF",
        route: "/wordtopdf",
      },
    ].map((tool, index) => (
      <Link href={tool.route} key={index} style={{ textDecoration: "none" }}>
        <div
          style={{
            backgroundColor: tool.color,
            color: "#666",
            borderRadius: "16px",
            padding: "2rem 1.5rem",
            aspectRatio: "1 / 1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            maxWidth: "160px",
            minHeight: "140px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div style={{ marginBottom: "1rem" }}>
            <i
              className={tool.icon}
              style={{
                fontSize: "2rem",
                color: "#666",
              }}
            ></i>
          </div>
          <h3
            style={{
              marginBottom: "0",
              fontSize: "0.95rem",
              fontWeight: "600",
              lineHeight: "1.2",
            }}
          >
            {tool.title}
          </h3>
        </div>
      </Link>
    ))}
  </div>

  <div
    style={{
      textAlign: "right",
      marginTop: "1.5rem",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
    }}
  >
    <Link
      href="/all"
      style={{
        color: "black",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "1.1rem",
      }}
    >
      View All
    </Link>
  </div>

  {/* ✅ Inline responsive styling */}
  <style jsx>{`
    @media (max-width: 768px) {
      div[style*="grid-template-columns"] {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 480px) {
      div[style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
      }
    }
  `}</style>
</section>




      {/* Easy Convert Your Files Section */}
      <section style={{ padding: "4rem 0" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4rem",
              flexWrap: "wrap",
            }}
          >
            {/* Left Content */}
            <div style={{ flex: "1", minWidth: "400px" }}>
              <h2
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  fontWeight: "",
                }}
              >
                Easy Convert Your Files
                <br />
                in Seconds
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "2rem",
                }}
              >
                Our user-friendly platform allows you to convert files
                effortlessly. Just drag and drop your documents to get started.
              </p>

              {/* Steps */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      backgroundColor: "",
                      padding: "1.5rem",
                      borderRadius: "12px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ fontSize: "2rem" }}>
                      <i
                        className="fas fa-folder"
                        style={{ color: "#FF6B6B" }}
                      ></i>
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Choose Files
                      </h3>
                      <p style={{ color: "#666", fontSize: "1rem" }}>
                        Start Customizing your file quickly and easily via an
                        intuitive interface.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      backgroundColor: "",
                      padding: "1.5rem",
                      borderRadius: "12px",
                    }}
                  >
                    <div style={{ fontSize: "2rem" }}>
                      <i
                        className="fas fa-upload"
                        style={{ color: "#FF6B6B" }}
                      ></i>
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Get Started
                      </h3>
                      <p style={{ color: "#666", fontSize: "1rem" }}>
                        Just upload and start converting your file in different
                        formats.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/learn-more"
                style={{
                  color: "#0070f3",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Learn More →
              </Link>
            </div>

            {/* Right Image */}
            <div style={{ flex: "1", textAlign: "center", minWidth: "400px" }}>
              <img
                src="/conversion-illustration.png"
                alt="File conversion process"
                style={{ width: "100%", maxWidth: "500px", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* App Store Downloads Section */}
      <section style={{ padding: "3rem 0", backgroundColor: "white" }}>
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3rem",
              flexWrap: "wrap",
            }}
          >
            {/* Chrome Web */}
            <div
              style={{
                display: "flex-bottom",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src="/chrome-web-badge.png"
                alt="Get it on Google Play"
                style={{ height: "60px" }}
              />
              <div style={{ display: "flex", margin: "1rem" }}>
                <div style={{ display: "flex", color: "#ffd700" }}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  300,000+ users
                </span>
              </div>
            </div>

            {/* Firefox Add-on */}
            <div
              style={{
                display: "flex-bottom",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src="/firefox-addon-badge.png"
                alt="Firefox Add-on"
                style={{ height: "60px" }}
              />
              <div style={{ display: "flex", margin: "1rem" }}>
                <div style={{ display: "flex", color: "#ffd700" }}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  10,000+ users
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "4rem 0", backgroundColor: "" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}
        >
          <div style={{ textAlign: "left", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "",
                marginBottom: "0.5rem",
              }}
            >
              Effortlessly transform documents
              <br />
              with powerful tools.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: (
                  <i className="fas fa-bolt" style={{ color: "#FF6B6B" }}></i>
                ),
                title: "Quick Convert & Compress",
                description:
                  "Our tool are designed for speed and reliability, ensuring your files are ready when you need them.",
                bgColor: "",
              },
              {
                icon: (
                  <i
                    className="fas fa-file-pdf"
                    style={{ color: "#FF8E53" }}
                  ></i>
                ),
                title: "Easy PDF Conversion",
                description:
                  "Experience robust conversion that maintains the highest quality and preserves your original formatting.",
                bgColor: "",
              },
              {
                icon: (
                  <i
                    className="fas fa-sync-alt"
                    style={{ color: "#FFD93D" }}
                  ></i>
                ),
                title: "Effortless File Merge",
                description:
                  "Combine your documents easily while preserving their original formatting and structure.",
                bgColor: "",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: feature.bgColor,
                  padding: "2rem",
                  borderRadius: "16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "",
                    marginBottom: "1rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {feature.description}
                </p>
                <button
                  style={{
                    color: "#0070f3",
                    backgroundColor: "transparent",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section style={{ padding: "4rem 0", backgroundColor: "white" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}
        >
          <div style={{ textAlign: "left", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "" }}>
              Convert your files in 3 quick, hassle-
              <br />
              free steps!
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: (
                  <i className="fas fa-bolt" style={{ color: "#FF6B6B" }}></i>
                ),
                title:
                  "Experience quick and easy file conversion in just a few clicks",
                description:
                  "Follow these easy steps to convert your file seamlessly.",
                bgColor: "",
              },
              {
                icon: (
                  <i className="fas fa-upload" style={{ color: "#FF8E53" }}></i>
                ),
                title: "Upload your file and select your desired output format",
                description:
                  "Our platform supports various formats for your convenience.",
                bgColor: "",
              },
              {
                icon: (
                  <i
                    className="fas fa-download"
                    style={{ color: "#FFD93D" }}
                  ></i>
                ),
                title: "Download your converted file instantly and safely",
                description:
                  "Our file is ready for download. just click the 'finish' button.",
                bgColor: "",
              },
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: step.bgColor,
                  padding: "2rem",
                  borderRadius: "16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "",
                    marginBottom: "1rem",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {step.description}
                </p>
                <button
                  style={{
                    color: "#0070f3",
                    backgroundColor: "transparent",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Convert →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section style={{ padding: "3rem 0", backgroundColor: "" }}>
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
        >
          <h3
            style={{ fontSize: "1.5rem", fontWeight: "", marginBottom: "2rem" }}
          >
            Trusted By:
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3rem",
              flexWrap: "wrap",
            }}
          >
            <img
              src="/google-cloud-logo.png"
              alt="Google Cloud"
              style={{ height: "40px", opacity: "0.6" }}
            />
            <img
              src="/onedrive-logo.png"
              alt="OneDrive"
              style={{ height: "40px", opacity: "0.6" }}
            />
            <img
              src="/norton-logo.png"
              alt="Norton"
              style={{ height: "40px", opacity: "0.6" }}
            />
            <img
              src="/dropbox-logo.png"
              alt="Dropbox"
              style={{ height: "40px", opacity: "0.6" }}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{ padding: "4rem 0", backgroundColor: "white" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4rem",
              flexWrap: "wrap",
            }}
          >
            {/* Left Content */}
            <div style={{ flex: "1", minWidth: "400px" }}>
              <h2
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  fontWeight: "",
                }}
              >
                Convert Files in a Click
                <br />
                <span>Fast, Easy & Free</span>
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "2rem",
                }}
              >
                Our user-friendly platform allows you to convert files
                effortlessly. Just drag and drop your documents to get started.
              </p>

              {/* Feature boxes */}
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div
                  style={{
                    backgroundColor: "",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    flex: "1",
                    minWidth: "200px",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    <i
                      className="fas fa-file-alt"
                      style={{ color: "#FF6B6B" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Completely Free
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Utilize unlimited file conversion with FileMint at no cost
                    whatsoever.
                  </p>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    Learn More →
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: "",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    flex: "1",
                    minWidth: "200px",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    <i className="fas fa-bolt" style={{ color: "#FF8E53" }}></i>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Fast Processing
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    Our tools files converted in seconds - our blazing your
                    valuable fast time.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div style={{ flex: "1", textAlign: "center", minWidth: "400px" }}>
              <img
                src="/final-cta-illustration.png"
                alt="File conversion illustration"
                style={{ width: "100%", maxWidth: "500px", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
}
