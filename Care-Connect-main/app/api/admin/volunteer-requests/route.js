import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import VolunteerRequest from "@/models/VolunteerRequest";
import VolunteerParticipation from "@/models/VolunteerParticipation";
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
    
    // Only superadmin can access (not home-admin)
    if (decoded.role === "home-admin" || decoded.role === "homeAdmin") {
      return { success: false, error: "Unauthorized. Superadmin access required." };
    }

    return { success: true, decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GET - Fetch all volunteer requests with filters (Superadmin only)
export async function GET(req) {
  try {
    await dbConnect();

    // Verify superadmin authentication
    const authResult = verifyAdminToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const homeId = searchParams.get("homeId");
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    // Build query
    let query = {};
    if (homeId && homeId !== "all") {
      query.homeId = homeId;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (date) {
      const dateObj = new Date(date);
      const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
      query.dateTime = { $gte: startOfDay, $lte: endOfDay };
    }

    // Fetch volunteer requests with home details
    const requests = await VolunteerRequest.find(query)
      .populate("homeId", "name location type")
      .sort({ createdAt: -1 });

    // Get volunteer counts for each request
    const requestsWithCounts = await Promise.all(
      requests.map(async (request) => {
        const volunteerCount = await VolunteerParticipation.countDocuments({
          volunteerRequestId: request._id,
        });
        return {
          ...request.toObject(),
          volunteerCount,
        };
      })
    );

    return NextResponse.json(
      { success: true, requests: requestsWithCounts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching volunteer requests:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching volunteer requests", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update volunteer request (disable/flag) - Superadmin
export async function PUT(req) {
  try {
    await dbConnect();

    // Verify superadmin authentication
    const authResult = verifyAdminToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    const { id, status, isFlagged } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Request ID is required" },
        { status: 400 }
      );
    }

    const request = await VolunteerRequest.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, message: "Volunteer request not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (status !== undefined) {
      request.status = status;
    }
    if (isFlagged !== undefined) {
      request.isFlagged = isFlagged;
    }

    await request.save();

    const updatedRequest = await VolunteerRequest.findById(id)
      .populate("homeId", "name location type");

    return NextResponse.json(
      {
        success: true,
        message: "Volunteer request updated successfully",
        request: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating volunteer request:", error);
    return NextResponse.json(
      { success: false, message: "Error updating volunteer request", error: error.message },
      { status: 500 }
    );
  }
}

