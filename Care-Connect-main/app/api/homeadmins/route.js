import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeAdmin from "@/models/HomeAdmin";

export async function GET() {
  try {
    await dbConnect();
    // Fetch all home admins and populate the home field to get home details
    const homeAdmins = await HomeAdmin.find({})
      .populate("home", "name location type")
      .select("-password") // Exclude password from response
      .sort({ createdAt: -1 }); // Sort by most recent first

    return NextResponse.json(
      { success: true, data: homeAdmins },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching home admins:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

