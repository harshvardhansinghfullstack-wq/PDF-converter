"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const SettingsPage: React.FC = () => {
  const { user, logout, token, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"account" | "subscription" | "settings">("account");

  // Account form state
  const [accountForm, setAccountForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeat: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setAccountForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accountForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Account updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update account" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setPasswordForm({ currentPassword: "", newPassword: "", repeatPassword: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const SidebarItem = (label: string, key: "account" | "subscription" | "settings") => (
    <div
      onClick={() => {
        setActiveTab(key);
        setMessage({ type: "", text: "" });
      }}
      style={{
        width: "80%",
        height: "30px",
        padding: "1rem 2rem",
        cursor: "pointer",
        fontWeight: 600,
        color: "#1e1e1e",
        backgroundColor: activeTab === key ? "#e6e8f2" : "transparent",
        borderLeft: activeTab === key ? "4px solid #1e2b50" : "none",
      }}
    >
      {label}
    </div>
  );

  // ✅ Safely get initials (prevents crash for OAuth users)
  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    const initials = (first + last).toUpperCase();
    return initials || "U";
  };

  // ✅ Safe display name
  const getDisplayName = () => {
    if (!user) return "";
    if (user.firstName || user.lastName)
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return user.email?.split("@")[0] || "User";
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ display: "flex", fontFamily: "Georgia, serif", height: "100vh", backgroundColor: "#fdf9f7" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "360px",
          backgroundColor: "#f7f7f9",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "2rem",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "3rem", color: "#1e1e2f" }}>FileMint</div>

        {/* Profile Image */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#1e2b50",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          {getInitials()}
        </div>

        <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "2rem", color: "#1e1e2f" }}>
          {getDisplayName()}
        </div>

        {SidebarItem("Account", "account")}
        {SidebarItem("Subscription", "subscription")}
        {SidebarItem("Settings", "settings")}

        {/* Logout Button */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            marginBottom: "2rem",
            width: "80%",
            padding: "1rem 2rem",
            backgroundColor: "#e63946",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "3rem", overflowY: "auto" }}>
        {message.text && (
          <div
            style={{
              padding: "12px 20px",
              borderRadius: "6px",
              marginBottom: "20px",
              backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Rest of your tabs remain exactly same */}
        {activeTab === "account" && (
          <>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "2rem" }}>Account</div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#1e2b50",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "20px",
                  marginRight: "1rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials()}
              </div>
              <div style={{ color: "#000", fontSize: "16px", cursor: "pointer" }}>✏️ Update profile</div>
            </div>

            <form onSubmit={handleAccountUpdate} style={{ marginBottom: "3rem" }}>
              <div>
                <div style={{ fontWeight: 600, marginTop: "1rem" }}>Email</div>
                <div style={{ margin: "4px 0" }}>{user.email}</div>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", maxWidth: "400px" }}>
                <label style={{ fontWeight: 600, marginBottom: "0.5rem" }}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={accountForm.firstName}
                  onChange={handleAccountChange}
                  placeholder="First Name"
                  style={{
                    padding: "15px 10px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginBottom: "1rem",
                  }}
                  required
                />
                <label style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={accountForm.lastName}
                  onChange={handleAccountChange}
                  placeholder="Last Name"
                  style={{
                    padding: "15px 10px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginBottom: "1rem",
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#999" : "#1e2b50",
                    color: "#fff",
                    padding: "15px 20px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginTop: "0.5rem",
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            {/* Change password section stays exactly the same */}
            <div style={{ fontSize: "20px", fontWeight: 600, marginTop: "2rem", marginBottom: "1.5rem" }}>
              Change Password
            </div>
            <form onSubmit={handlePasswordUpdate}>
              <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
                {[
                  { name: "currentPassword", label: "Current Password", key: "current" },
                  { name: "newPassword", label: "New Password", key: "new" },
                  { name: "repeatPassword", label: "Repeat Password", key: "repeat" },
                ].map((field) => (
                  <div key={field.name} style={{ position: "relative", marginBottom: "1rem" }}>
                    <input
                      type={showPassword[field.key as keyof typeof showPassword] ? "text" : "password"}
                      name={field.name}
                      value={passwordForm[field.name as keyof typeof passwordForm]}
                      onChange={handlePasswordChange}
                      placeholder={field.label}
                      style={{
                        padding: "15px 12px",
                        fontSize: "14px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                      }}
                      required
                    />
                    <span
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          [field.key]: !showPassword[field.key as keyof typeof showPassword],
                        })
                      }
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword[field.key as keyof typeof showPassword] ? "🙈" : "👁️"}
                    </span>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#999" : "#1e2b50",
                    color: "#fff",
                    padding: "15px 20px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginTop: "0.5rem",
                  }}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Subscription + Settings sections remain unchanged */}
        {activeTab === "subscription" && (
          <>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "1.5rem" }}>Subscriptions</div>
            <div
              style={{
                color: "#304ffe",
                textDecoration: "underline",
                fontWeight: 600,
                marginBottom: "1.5rem",
                cursor: "pointer",
              }}
            >
              Upgrade to Premium 💎
            </div>
            {[
              "Full access to all tools in FileMint",
              "Unlimited storage for all your files",
              "Work on Web, Mobile and Desktop",
              "Convert scanned PDF to Word with OCR, Sign with digital signatures, audio to PDF, PDF language Converter, API Generator, Bulk PDF Merge",
              "No Ads.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "1rem", fontSize: "18px" }}>
                <span style={{ color: "green", fontSize: "20px", marginRight: "10px" }}>✓</span> {item}
              </div>
            ))}
          </>
        )}

        {activeTab === "settings" && (
          <>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "1.5rem" }}>Preferences</div>

            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontWeight: 600, fontSize: "18px" }}>Language</div>
              <div style={{ margin: "4px 0" }}>English</div>
              <div style={{ color: "#304ffe", textDecoration: "underline", cursor: "pointer" }}>Change</div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontWeight: 600, fontSize: "18px" }}>Email Notifications</div>
              <div style={{ margin: "4px 0" }}>
                No longer wish to receive promotional emails from us? You can do so here.
              </div>
              <div style={{ color: "red", cursor: "pointer" }}>Disable Emails</div>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: "18px" }}>Manage Account</div>
              <div style={{ color: "red", cursor: "pointer", marginTop: "4px" }}>Delete Account</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
