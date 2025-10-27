import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../routes/mongo";
import User from "../../../models/user";  // assuming you have a `User` model in the models folder
import bcrypt from "bcryptjs";

// This function is used to handle POST requests for user sign up
export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Get the request body data
    const { firstName, lastName, email, password, termsAccepted } = await req.json();

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Validate input fields
    if (!firstName || !lastName || !email || !password || termsAccepted === undefined) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      termsAccepted,
    });

    // Save the new user to the database
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error during sign-up:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
