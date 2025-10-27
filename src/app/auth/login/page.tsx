"use client";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left half: illustration */}
      <div style={{ flex: 1, position: "relative" }}>
        <Image
          src="/profile-icon.png"
          alt="Login Illustration"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Right half: form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#f9f9f9",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Log In To <span style={{ color: "#1D4ED8" }}>FileMint</span>
          </h2>
          <form style={{ display: "grid", gap: "1rem" }}>
            <input
              type="email"
              placeholder="Email"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.75rem",
                background: "#1D4ED8",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Log In
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Don’t have an account?{" "}
            <Link href="/signup" style={{ color: "#1D4ED8" }}>
              Create Account
            </Link>
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              style={{
                flex: 1,
                padding: "0.5rem",
                border: "1px solid #1D4ED8",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Continue with Google
            </button>
            <button
              style={{
                flex: 1,
                padding: "0.5rem",
                border: "1px solid #1D4ED8",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
