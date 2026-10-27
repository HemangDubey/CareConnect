import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import HomeAdmin from "@/models/HomeAdmin";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // find admin
    const homeAdmin = await HomeAdmin.findOne({ email }).populate("home");
    console.log("Entered:", password);
console.log("Stored:", homeAdmin.password);
console.log("Match?", await bcrypt.compare(password, homeAdmin.password));

    if (!homeAdmin) {
      return NextResponse.json({ success: false, error: "Admin not found" }, { status: 400 });
    }

    // check password
    const isMatch = await bcrypt.compare(password, homeAdmin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 });
    }

    // issue JWT
    const token = jwt.sign(
      { id: homeAdmin._id, role: "home-admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: homeAdmin._id,
        name: homeAdmin.name,
        email: homeAdmin.email,
        home: homeAdmin.home
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
