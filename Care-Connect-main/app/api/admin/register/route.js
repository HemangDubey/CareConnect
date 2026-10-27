import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import dbConnect from "@/lib/mongodb";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    return NextResponse.json({ message: "Admin registered successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
