import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import connectMongo from "@/app/routes/mongo";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const provider = url.searchParams.get("provider");

    if (!code || !provider)
      return NextResponse.json({ error: "Missing code/provider" }, { status: 400 });

    let email = "", firstName = "", lastName = "";

    // ---------------- GOOGLE LOGIN ----------------
    if (provider === "google") {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth-callback?provider=google`,
          grant_type: "authorization_code",
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      const userRes = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await userRes.json();

      email = userInfo.email;
      firstName = userInfo.given_name || userInfo.name?.split(" ")[0] || "User";
      lastName = userInfo.family_name || userInfo.name?.split(" ")[1] || "";

    // ---------------- GITHUB LOGIN ----------------
    } else if (provider === "github") {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GITHUB_CLIENT_ID!,
          client_secret: process.env.GITHUB_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth-callback?provider=github`,
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await userRes.json();

      let primaryEmail = userInfo.email;
      if (!primaryEmail) {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const emails = await emailsRes.json();
        const primary = emails.find((e: any) => e.primary) || emails[0];
        primaryEmail = primary.email;
      }

      email = primaryEmail;
      firstName = userInfo.name?.split(" ")[0] || userInfo.login || "User";
      lastName = userInfo.name?.split(" ")[1] || "";
    }

    // ---------------- CREATE OR FIND USER ----------------
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        provider,
        password: null,       // ✅ password not required for OAuth
        termsAccepted: true,  // ✅ prevents validation error
      });
    }

    // ---------------- GENERATE JWT ----------------
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // ---------------- REDIRECT ----------------
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
    response.cookies.set("token", token, { httpOnly: false, path: "/" });

    return response;

  } catch (error: any) {
    console.error("OAuth callback error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
