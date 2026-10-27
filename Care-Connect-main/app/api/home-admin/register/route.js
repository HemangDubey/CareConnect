import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import HomeAdmin from "@/models/HomeAdmin";
import Home from "@/models/Home";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, homeId } = await req.json();

    if (!name || !email || !password || !homeId) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingAdmin = await HomeAdmin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin already exists" },
        { status: 400 }
      );
    }

    const homeExists = await Home.findById(homeId);
    if (!homeExists) {
      return NextResponse.json(
        { success: false, error: "Home not found" },
        { status: 404 }
      );
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await HomeAdmin.create({
      name,
      email,
      password: password,
      home: homeId,
    });

    return NextResponse.json({
      success: true,
      message: "Home admin created successfully",
      admin,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
