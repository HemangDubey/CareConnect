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

// PUT - Update donation status
export async function PUT(req, context) {
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

    const { id } = await context.params;
    const { status } = await req.json();

    // Validate status
    if (!status || !['Pending', 'Accepted', 'Completed'].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status. Must be Pending, Accepted, or Completed" },
        { status: 400 }
      );
    }

    // Find donation
    const donation = await Donation.findById(id);
    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const { decoded } = authResult;
    if (decoded.role === "home-admin") {
      // Home admin can only update their home's donations
      const homeAdmin = await HomeAdmin.findById(decoded.id);
      if (!homeAdmin || homeAdmin.home.toString() !== donation.homeId.toString()) {
        return NextResponse.json(
          { success: false, message: "Unauthorized to update this donation" },
          { status: 403 }
        );
      }
    }
    // Superadmin (no role field) can update any donation

    // Update donation status
    donation.status = status;
    await donation.save();

    return NextResponse.json(
      {
        success: true,
        message: "Donation status updated successfully",
        donation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating donation:", error);
    return NextResponse.json(
      { success: false, message: "Error updating donation", error: error.message },
      { status: 500 }
    );
  }
}

