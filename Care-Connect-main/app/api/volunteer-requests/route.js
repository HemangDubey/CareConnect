import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import VolunteerRequest from "@/models/VolunteerRequest";
import Home from "@/models/Home";
import HomeAdmin from "@/models/HomeAdmin";
import { verifyHomeAdmin } from "@/lib/authMiddleware";

// GET - Fetch all volunteer requests for a home (home admin)
export async function GET(req) {
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

    // Get home admin to find their home
    const homeAdmin = await HomeAdmin.findById(authResult.adminId).populate("home");
    if (!homeAdmin || !homeAdmin.home) {
      return NextResponse.json(
        { success: false, message: "Home admin not found or no home assigned" },
        { status: 404 }
      );
    }

    // Get homeId from query params if provided, otherwise use admin's home
    const { searchParams } = new URL(req.url);
    const homeId = searchParams.get("homeId") || homeAdmin.home._id.toString();

    // Verify the admin owns this home
    if (homeAdmin.home._id.toString() !== homeId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to view requests for this home" },
        { status: 403 }
      );
    }

    // Fetch volunteer requests for this home
    const requests = await VolunteerRequest.find({ homeId })
      .populate("homeId", "name location")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, requests },
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

// POST - Create a new volunteer request (home admin)
export async function POST(req) {
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

    const { title, description, numberOfVolunteersRequired, dateTime, location, homeId } = await req.json();

    // Validate input
    if (!title || !description || !numberOfVolunteersRequired || !dateTime || !location) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Get home admin to find their home
    const homeAdmin = await HomeAdmin.findById(authResult.adminId).populate("home");
    if (!homeAdmin || !homeAdmin.home) {
      return NextResponse.json(
        { success: false, message: "Home admin not found or no home assigned" },
        { status: 404 }
      );
    }

    // Use provided homeId or admin's home
    const targetHomeId = homeId || homeAdmin.home._id.toString();

    // Verify the admin owns this home
    if (homeAdmin.home._id.toString() !== targetHomeId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to create requests for this home" },
        { status: 403 }
      );
    }

    // Check if home exists
    const home = await Home.findById(targetHomeId);
    if (!home) {
      return NextResponse.json(
        { success: false, message: "Home not found" },
        { status: 404 }
      );
    }

    // Validate dateTime is in the future
    const requestDateTime = new Date(dateTime);
    if (requestDateTime < new Date()) {
      return NextResponse.json(
        { success: false, message: "Date and time must be in the future" },
        { status: 400 }
      );
    }

    // Create new volunteer request
    const newRequest = await VolunteerRequest.create({
      homeId: targetHomeId,
      title,
      description,
      numberOfVolunteersRequired: parseInt(numberOfVolunteersRequired),
      dateTime: requestDateTime,
      location,
      status: "open",
    });

    const populatedRequest = await VolunteerRequest.findById(newRequest._id)
      .populate("homeId", "name location");

    return NextResponse.json(
      {
        success: true,
        message: "Volunteer request created successfully",
        request: populatedRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating volunteer request:", error);
    return NextResponse.json(
      { success: false, message: "Error creating volunteer request", error: error.message },
      { status: 500 }
    );
  }
}

