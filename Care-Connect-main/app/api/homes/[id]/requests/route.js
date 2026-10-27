/**
 * API Route: /api/homes/[id]/requests
 * 
 * Handles requests management for a specific home
 * GET: Fetch all requests for a home
 * POST: Create a new request for a home
 */

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Home from "@/models/Home";
import Request from "@/models/Request";
import HomeAdmin from "@/models/HomeAdmin";
import { verifyHomeAdmin } from "@/lib/authMiddleware";

// 🟢 GET — Fetch all requests for a specific home
export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params; // Next.js 15 requires await for params

    const requests = await Request.find({ homeId: id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching requests", error: error.message },
      { status: 500 }
    );
  }
}

// 🟠 POST — Create new request for this home
export async function POST(request, context) {
  try {
    await dbConnect();
    
    // Verify home admin authentication
    const authResult = verifyHomeAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    const { id } = await context.params; // Next.js 15 requires await for params
    const { title, description } = await request.json();

    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    // Check if home exists
    const home = await Home.findById(id);
    if (!home) {
      return NextResponse.json(
        { success: false, message: "Home not found" },
        { status: 404 }
      );
    }

    // Verify the admin owns this home
    const homeAdmin = await HomeAdmin.findById(authResult.adminId);
    if (!homeAdmin || homeAdmin.home.toString() !== id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to create requests for this home" },
        { status: 403 }
      );
    }

    // Create new request
    const newRequest = await Request.create({
      homeId: id,
      title,
      description,
      status: "active",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request created successfully",
        request: newRequest
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error creating request", error: error.message },
      { status: 500 }
    );
  }
}
