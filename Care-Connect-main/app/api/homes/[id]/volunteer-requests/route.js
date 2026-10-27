import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import VolunteerRequest from "@/models/VolunteerRequest";
import Home from "@/models/Home";

// GET - Fetch all open volunteer requests for a specific home (public)
export async function GET(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    // Check if home exists
    const home = await Home.findById(id);
    if (!home) {
      return NextResponse.json(
        { success: false, message: "Home not found" },
        { status: 404 }
      );
    }

    // Fetch only open volunteer requests for this home
    const requests = await VolunteerRequest.find({
      homeId: id,
      status: "open",
    })
      .populate("homeId", "name location")
      .sort({ dateTime: 1 }); // Sort by date, earliest first

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

