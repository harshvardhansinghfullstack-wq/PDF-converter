import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/user";
import connectMongo from "../../../routes/mongo";

// Handle POST requests to the login route
export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongo();

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 400 });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    // Send response with the token
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}