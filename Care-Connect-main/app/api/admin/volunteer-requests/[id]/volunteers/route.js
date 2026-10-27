import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import VolunteerParticipation from "@/models/VolunteerParticipation";
import VolunteerRequest from "@/models/VolunteerRequest";
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

// GET - Get list of volunteers for a specific request (Superadmin only)
export async function GET(req, context) {
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

    const { id } = await context.params;

    // Check if volunteer request exists
    const volunteerRequest = await VolunteerRequest.findById(id);
    if (!volunteerRequest) {
      return NextResponse.json(
        { success: false, message: "Volunteer request not found" },
        { status: 404 }
      );
    }

    // Fetch all volunteers for this request
    const participations = await VolunteerParticipation.find({
      volunteerRequestId: id,
    })
      .populate("userId", "name email image")
      .sort({ timestamp: -1 });

    return NextResponse.json(
      {
        success: true,
        volunteers: participations,
        request: volunteerRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching volunteers", error: error.message },
      { status: 500 }
    );
  }
}

