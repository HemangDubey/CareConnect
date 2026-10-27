import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import VolunteerRequest from "@/models/VolunteerRequest";
import { verifyHomeAdmin } from "@/lib/authMiddleware";
import HomeAdmin from "@/models/HomeAdmin";

// GET - Get a specific volunteer request
export async function GET(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const request = await VolunteerRequest.findById(id)
      .populate("homeId", "name location type");

    if (!request) {
      return NextResponse.json(
        { success: false, message: "Volunteer request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, request },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching volunteer request:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching volunteer request", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update volunteer request (disable/flag) - Home Admin or Superadmin
export async function PUT(req, context) {
  try {
    await dbConnect();

    // Verify home admin authentication
    const authResult = verifyHomeAdmin(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { status, isFlagged } = await req.json();

    const request = await VolunteerRequest.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, message: "Volunteer request not found" },
        { status: 404 }
      );
    }

    // Verify the admin owns the home for this request
    const homeAdmin = await HomeAdmin.findById(authResult.adminId);
    if (homeAdmin && homeAdmin.home.toString() !== request.homeId.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to update this request" },
        { status: 403 }
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
      .populate("homeId", "name location");

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

