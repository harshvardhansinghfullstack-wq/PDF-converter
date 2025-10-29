"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();

  // ✅ Safe initials generator with fallback
  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.charAt(0) || user.email?.charAt(0) || "?";
    const last = user.lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="logo-container">
          <Link href="/">
            <img src="/Group-14.svg" alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <ul>
            <li><a href="/"><span className="nav-link">Home</span></a></li>
            <li><a href="/all"><span className="nav-link">Tools</span></a></li>
            <li><a href="/blogs"><span className="nav-link">Blogs</span></a></li>
            <li><a href="/about"><span className="nav-link">About</span></a></li>
            <li><a href="/settings"><img src="subway_world.png" alt="Settings" /></a></li>

            {/* Mobile Login/Profile */}
            {!isLoading && (
              <>
                {!user ? (
                  <li className="mobile-only">
                    <a className="no-underline" href="/login">
                      <span className="nav-link login">Login</span>
                    </a>
                  </li>
                ) : (
                  <li className="mobile-only">
                    <Link href="/profile">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Profile"
                          className="profile-circle"
                        />
                      ) : (
                        <div className="profile-circle">{getInitials()}</div>
                      )}
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Desktop Right Section */}
        {!isLoading && (
          <div className="right desktop-only">
            {!user ? (
              <a href="/login" className="no-underline">
                <span className="nav-link login">Login</span>
              </a>
            ) : (
              <Link href="/profile">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="profile-circle"
                  />
                ) : (
                  <div className="profile-circle">{getInitials()}</div>
                )}
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ✅ Styles */}
      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px;
          position: relative;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          gap: 36px;
          z-index: 1000;
        }

        .logo-container {
          position: absolute;
          left: 2rem;
        }

        .logo {
          margin-left: 50px;
          height: 40px;
          cursor: pointer;
        }

        .no-underline {
          text-decoration: none !important;
        }

        .nav {
          background-color: #f0f8ff;
          padding: 1.3rem 2.5rem;
          border-radius: 20px;
          width: 25%;
          text-align: center;
          margin: 10px auto 0 auto;
          transition: all 0.3s ease;
        }

        .nav ul {
          display: flex;
          justify-content: space-around;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 1.1rem;
          gap: 10px;
        }

        .nav-link {
          color: black !important;
          text-decoration: none !important;
          font-weight: 500;
        }

        .nav-link:hover {
          color: #0077cc !important;
        }

        .right {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: absolute;
          right: 2rem;
        }

        .login {
          margin-right: 1rem;
          color: white;
          background-color: #74caffff;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
        }

        .profile-circle {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1e2b50;
          color: #fff;
          font-weight: bold;
          font-size: 16px;
          border: 2px solid #1d4ed8;
          cursor: pointer;
          transition: transform 0.2s;
          margin-right: 50px;
          object-fit: cover;
        }

        .profile-circle:hover {
          transform: scale(1.1);
        }

        /* Hamburger menu for mobile */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 20px;
          cursor: pointer;
          position: absolute;
          right: 1.5rem;
        }

        .hamburger span {
          display: block;
          height: 3px;
          width: 100%;
          background-color: black;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translateY(8px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translateY(-8px);
        }

        /* Responsive Styles */
       @media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav {
    display: none;
    width: 100%;
    position: absolute;
    top: 70px;
    left: 0;
    background: #f0f8ff;
    padding: 1.5rem 0; /* 🔼 increased padding */
    border-radius: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* nice drop shadow */
    
  }

  .nav.active {
    display: block;
    animation: slideDown 0.3s ease;
  }

  .nav ul {
    flex-direction: column;
    gap: 16px; /* 🔼 add more spacing between items */
    margin: 0;
    padding: 0;
  }

  .nav li {
    padding: 0.5rem 0; /* 🔼 give each item some vertical space */
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}


        @media (min-width: 769px) {
          .mobile-only {
            display: none;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav a,
        .nav a span.nav-link,
        nav-link {
          text-decoration: none !important;
        }

        .nav a:hover,
        .nav a span.nav-link:hover,
        nav-link {
          text-decoration: none !important;
          color: #000000ff !important;
        }
          @media (max-width: 768px) {
  .nav {
    position: absolute;
    top: 100%;        /* attaches nav exactly below the header */
    left: 0;
    width: 100%;
    background: #f0f8ff;
    border-top: none;
    box-shadow: none; /* removes shadow line effect */
    z-index: 999;
   
  }

  .header {
    box-shadow: none; /* remove header shadow on mobile for clean look */
  }
    .logo-container{
    margin-top:30px;,
    }
}

      `}</style>
    </>
  );
}
