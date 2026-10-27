import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeRequest from "@/models/HomeRequest";
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

// PUT - Reject a home registration request (Superadmin only)
export async function PUT(req, { params }) {
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

    // Only superadmin can access
    if (decoded.role === "home-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Superadmin access required." },
        { status: 403 }
      );
    }

    const { id } = params;

    // Find the request
    const homeRequest = await HomeRequest.findById(id);
    if (!homeRequest) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    // Check if already processed
    if (homeRequest.status !== "Pending") {
      return NextResponse.json(
        { success: false, error: `Request has already been ${homeRequest.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Update request status
    homeRequest.status = "Rejected";
    await homeRequest.save();

    return NextResponse.json(
      {
        success: true,
        message: "Home registration rejected successfully",
        data: homeRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting home request:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

