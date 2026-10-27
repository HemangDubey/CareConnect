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

// POST - Submit a new home registration request (Public)
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { homeName, adminName, email, phone, address, description, homePhoto, documentUrl, upiId, qrImage } = body;

    // Validate required fields
    if (!homeName || !adminName || !email || !phone || !address || !homePhoto) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided, including home photo" },
        { status: 400 }
      );
    }

    // Check if email already has a pending request
    const existingRequest = await HomeRequest.findOne({
      email,
      status: "Pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: "You already have a pending registration request" },
        { status: 400 }
      );
    }

    // Create the request
    const homeRequest = await HomeRequest.create({
      homeName,
      adminName,
      email,
      phone,
      address,
      description,
      homePhoto: homePhoto || null,
      documentUrl: documentUrl || null,
      upi: {
        vpa: upiId || null,
        qrImageUrl: qrImage || null
      },
      status: "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration request submitted successfully",
        data: homeRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating home request:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all home requests (Superadmin only)
export async function GET(req) {
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

    // Only superadmin can access (no role field or role !== "home-admin")
    if (decoded.role === "home-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Superadmin access required." },
        { status: 403 }
      );
    }

    // Fetch all requests, sorted by newest first
    const requests = await HomeRequest.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: requests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching home requests:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

