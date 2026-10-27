import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeRequest from "@/models/HomeRequest";
import Home from "@/models/Home";
import HomeAdmin from "@/models/HomeAdmin";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

// Generate a random password
function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex');
}

// PUT - Approve a home registration request (Superadmin only)
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

    // Check if email already exists in HomeAdmin
    const existingAdmin = await HomeAdmin.findOne({ email: homeRequest.email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "A home admin with this email already exists" },
        { status: 400 }
      );
    }

    // Determine home type from description or default to orphanage
    // You might want to add a type field to HomeRequest in the future
    const homeType = homeRequest.description?.toLowerCase().includes("old age") || 
                     homeRequest.description?.toLowerCase().includes("oldage") 
                     ? "oldage" : "orphanage";

    // Create the Home
    const home = await Home.create({
      name: homeRequest.homeName,
      type: homeType,
      location: homeRequest.address,
      contact: homeRequest.phone,
      description: homeRequest.description,
      imageUrl: homeRequest.homePhoto || null,
      upi: {
        vpa: homeRequest.upi?.vpa || null,
        qrImageUrl: homeRequest.upi?.qrImageUrl || null
      },
    });

    // Generate a random password for the admin
    const tempPassword = generateRandomPassword();

    // Create the HomeAdmin (password will be hashed by pre-save hook)
    const homeAdmin = await HomeAdmin.create({
      name: homeRequest.adminName,
      email: homeRequest.email,
      password: tempPassword, // Will be hashed by pre-save hook
      home: home._id,
    });

    // Update request status
    homeRequest.status = "Approved";
    await homeRequest.save();

    // TODO: Send email with credentials (email, tempPassword)
    // For now, we'll return the password in the response
    // In production, you should send this via email and not return it

    return NextResponse.json(
      {
        success: true,
        message: "Home registration approved successfully",
        data: {
          home,
          homeAdmin: {
            ...homeAdmin.toObject(),
            password: undefined, // Don't return password
          },
          tempPassword, // Return temp password - should be sent via email in production
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving home request:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

