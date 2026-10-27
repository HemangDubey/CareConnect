import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import jwt from "jsonwebtoken";

// Helper to verify user token
function verifyUserToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { success: true, userId: decoded.id || decoded.userId, email: decoded.email };
      }
    }
    return { success: false, error: "No token provided" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GET - Fetch user's donations
export async function GET(req) {
  try {
    await dbConnect();

    // Try to verify token, but also allow email from query params for flexibility
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    const authResult = verifyUserToken(req);
    let userEmail = email;

    // If token is provided, use email from token
    if (authResult.success && authResult.email) {
      userEmail = authResult.email;
    }

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Fetch donations by donor email
    const donations = await Donation.find({ donorEmail: userEmail })
      .populate("homeId", "name location type")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, donations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user donations:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching donations", error: error.message },
      { status: 500 }
    );
  }
}

