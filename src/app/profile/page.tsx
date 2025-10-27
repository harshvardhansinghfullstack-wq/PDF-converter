"use client";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProfilePage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) return null;

  // ✅ Prevent crash if OAuth user doesn't have names
  const firstName = user.firstName || "User";
  const lastName = user.lastName || "";
  const email = user.email || "No email available";

  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "U";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f7",
        paddingTop: "100px",
        paddingBottom: "50px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e2b50 0%, #2d3a6b 100%)",
            padding: "50px 40px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              color: "#1e2b50",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
              fontWeight: "bold",
              margin: "0 auto 20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            {getInitials()}
          </div>
          <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
            {firstName} {lastName}
          </h1>
          <p style={{ fontSize: "18px", opacity: 0.9 }}>{email}</p>
        </div>

        {/* Profile Info */}
        <div style={{ padding: "40px" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "20px",
                color: "#1e2b50",
              }}
            >
              Profile Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  First Name
                </div>
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                >
                  {firstName}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Last Name
                </div>
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                >
                  {lastName || "—"}
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Email Address
                </div>
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                >
                  {email}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/settings"
              style={{ textDecoration: "none", flex: 1, minWidth: "200px" }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "15px 30px",
                  backgroundColor: "#1e2b50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d3a6b")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e2b50")
                }
              >
                ✏️ Edit Profile
              </button>
            </Link>

            <button
              onClick={logout}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "15px 30px",
                backgroundColor: "#fff",
                color: "#e63946",
                border: "2px solid #e63946",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e63946";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#e63946";
              }}
            >
              🚪 Logout
            </button>
          </div>

          {/* Account Status */}
          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#1e2b50",
              }}
            >
              Account Status
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>✅</span>
              <div>
                <div style={{ fontWeight: "600", fontSize: "16px" }}>
                  Active Account
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Your account is active and in good standing
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: "30px" }}>
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#1e2b50",
              }}
            >
              Quick Actions
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
              }}
            >
              {[
                { icon: "🔒", title: "Change Password", desc: "Update your account password" },
                { icon: "⚙️", title: "Account Settings", desc: "Manage preferences and settings" },
                { icon: "💎", title: "Upgrade Premium", desc: "Get access to premium features" },
              ].map((item, i) => (
                <Link href="/settings" style={{ textDecoration: "none" }} key={i}>
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#fff",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#1e2b50";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#e0e0e0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                      {item.icon}
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "#1e2b50",
                        marginBottom: "5px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {item.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
