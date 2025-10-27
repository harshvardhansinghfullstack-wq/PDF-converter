import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/app/routes/mongo";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();
    const { email, firstName, lastName, provider } = body;

    if (!email || !provider) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        password: null,
        provider,
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("OAuth login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
