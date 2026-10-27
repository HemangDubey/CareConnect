import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import HomeAdmin from "@/models/HomeAdmin";
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

// GET - Fetch donations
// Superadmin can see all donations
// Home admin can see only their home's donations
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
    let donations;

    // Check if user is home-admin
    // Superadmin tokens don't have a role field, home-admin tokens have role: "home-admin"
    if (decoded.role === "home-admin") {
      // Home admin - get their home's donations
      const homeAdmin = await HomeAdmin.findById(decoded.id).populate('home');
      if (!homeAdmin) {
        return NextResponse.json(
          { success: false, message: "Home admin not found" },
          { status: 404 }
        );
      }

      donations = await Donation.find({ homeId: homeAdmin.home._id })
        .populate('homeId', 'name location')
        .sort({ createdAt: -1 });
    } else {
      // Superadmin (no role or admin role) - get all donations
      donations = await Donation.find({})
        .populate('homeId', 'name location')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(
      {
        success: true,
        donations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching donations", error: error.message },
      { status: 500 }
    );
  }
}

