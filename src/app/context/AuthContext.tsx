"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string, termsAccepted: boolean) => Promise<void>;
  oauthLogin: (provider: "google" | "github") => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
 useEffect(() => {
  // 1️⃣ Try to get token from localStorage first
  let storedToken = localStorage.getItem("token");

  if (!storedToken) {
    // 2️⃣ If not in localStorage, try to get it from cookie
    storedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (storedToken) {
      // 3️⃣ Save cookie token into localStorage
      localStorage.setItem("token", storedToken);
    }
  }

  if (storedToken) {
    setToken(storedToken);
    fetchUserProfile(storedToken);
  } else {
    setIsLoading(false);
  }

  // 4️⃣ Handle OAuth callback if URL has code & provider
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const provider = urlParams.get("provider") as "google" | "github" | null;
  if (code && provider) {
    handleOAuthCallback(code, provider);
  }
}, []);


  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      setToken(data.token);
      await fetchUserProfile(data.token);
      router.push("/");
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    termsAccepted: boolean
  ) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, termsAccepted }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed");

      await login(email, password);
    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
    }
  };

  const oauthLogin = (provider: "google" | "github") => {
    window.location.href = `/api/auth/${provider}-login`; // Your backend endpoint generates OAuth URL and redirects
  };

  const handleOAuthCallback = async (code: string, provider: "google" | "github") => {
    try {
      const res = await fetch(`/api/auth/oauth-callback?code=${code}&provider=${provider}`);
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        await fetchUserProfile(data.token);
        router.replace("/"); // Remove code from URL
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) setUser({ ...user, ...userData });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, oauthLogin, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
