import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Helper function to verify admin token
function verifyAdminToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return { success: false, error: "No token provided" };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return { success: false, error: "Invalid token format" };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GET - Fetch all users (Superadmin only)
export async function GET(req) {
  try {
    await dbConnect();

    // Verify authentication
    const authResult = verifyAdminToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    const { decoded } = authResult;

    // Only superadmin can access (no role field or role !== "home-admin")
    // Home-admin tokens have role: "home-admin", so we exclude them
    if (decoded.role === "home-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Superadmin access required." },
        { status: 403 }
      );
    }

    // Fetch all users
    const users = await User.find({})
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

