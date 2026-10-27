// file: app/api/requests/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Request from "@/models/Request";

export const dynamic = "force-dynamic";

// GET /api/requests/[id] - Get request by ID (public)
export async function GET(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;
    const request = await Request.findById(id).populate("homeId", "name location");

    if (!request) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: request }, { status: 200 });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



