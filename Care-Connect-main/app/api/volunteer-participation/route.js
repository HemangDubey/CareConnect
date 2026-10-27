import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import VolunteerParticipation from "@/models/VolunteerParticipation";
import VolunteerRequest from "@/models/VolunteerRequest";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Helper to verify user token
function verifyUserToken(req) {
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
    return {
      success: true,
      userId: decoded.id || decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    // Also check NextAuth session token
    try {
      const token = req.headers.get("authorization")?.split(" ")[1];
      if (token) {
        const decoded = jwt.decode(token);
        if (decoded && decoded.sub) {
          // NextAuth token
          return {
            success: true,
            userId: decoded.sub,
            email: decoded.email,
            name: decoded.name,
          };
        }
      }
    } catch {}
    return { success: false, error: error.message };
  }
}

// POST - User volunteers for a request
export async function POST(req) {
  try {
    await dbConnect();

    // Read request body once
    const { volunteerRequestId, userId } = await req.json();

    // Verify user authentication
    const authResult = verifyUserToken(req);
    if (!authResult.success && !userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please login first." },
        { status: 401 }
      );
    }

    if (!volunteerRequestId) {
      return NextResponse.json(
        { success: false, message: "Volunteer request ID is required" },
        { status: 400 }
      );
    }

    // Use userId from auth or request body
    const targetUserId = authResult.userId || userId;
    const targetEmail = authResult.email;
    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "User ID is required. Please login first." },
        { status: 401 }
      );
    }

    // Validate volunteerRequestId
    if (!mongoose.isValidObjectId(volunteerRequestId)) {
      return NextResponse.json(
        { success: false, message: "Invalid volunteer request ID" },
        { status: 400 }
      );
    }

    // Check if volunteer request exists and is open
    const volunteerRequest = await VolunteerRequest.findById(volunteerRequestId);
    if (!volunteerRequest) {
      return NextResponse.json(
        { success: false, message: "Volunteer request not found" },
        { status: 404 }
      );
    }

    if (volunteerRequest.status !== "open") {
      return NextResponse.json(
        { success: false, message: "This volunteer request is no longer open" },
        { status: 400 }
      );
    }

    // Check if user exists - try to find by _id or id
    let user = null;
    if (mongoose.isValidObjectId(targetUserId)) {
      user = await User.findById(targetUserId);
    }
    if (!user && targetUserId) {
      // Try finding by email if userId is actually an email or external identifier
      user = await User.findOne({ email: targetUserId });
    }
    if (!user && targetEmail) {
      user = await User.findOne({ email: targetEmail });
    }
    if (!user && targetEmail) {
      // Create user on the fly for external providers (e.g., Google) if missing
      user = await User.create({
        name: authResult.name || "Volunteer",
        email: targetEmail,
        provider: "google",
      });
    }
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found. Please make sure you are logged in." },
        { status: 404 }
      );
    }

    // Use the actual user ID from the database
    const actualUserId = user._id.toString();

    // Check if user already volunteered for this request
    const existingParticipation = await VolunteerParticipation.findOne({
      userId: actualUserId,
      volunteerRequestId,
    });

    if (existingParticipation) {
      return NextResponse.json(
        { success: false, message: "You have already volunteered for this request" },
        { status: 400 }
      );
    }

    // Create volunteer participation
    const participation = await VolunteerParticipation.create({
      userId: actualUserId,
      volunteerRequestId,
      timestamp: new Date(),
    });

    const populatedParticipation = await VolunteerParticipation.findById(participation._id)
      .populate("userId", "name email")
      .populate("volunteerRequestId", "title dateTime location");

    return NextResponse.json(
      {
        success: true,
        message: "Successfully volunteered for this request",
        participation: populatedParticipation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating volunteer participation:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "You have already volunteered for this request" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Error creating volunteer participation", error: error.message },
      { status: 500 }
    );
  }
}

// GET - Get volunteer participations (for a user or a request)
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const volunteerRequestId = searchParams.get("volunteerRequestId");

    let query = {};
    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return NextResponse.json(
          { success: true, participations: [] },
          { status: 200 }
        );
      }
      query.userId = userId;
    }
    if (volunteerRequestId) {
      if (!mongoose.isValidObjectId(volunteerRequestId)) {
        return NextResponse.json(
          { success: true, participations: [] },
          { status: 200 }
        );
      }
      query.volunteerRequestId = volunteerRequestId;
    }

    const participations = await VolunteerParticipation.find(query)
      .populate("userId", "name email image")
      .populate({
        path: "volunteerRequestId",
        populate: {
          path: "homeId",
          select: "name location",
        },
      })
      .sort({ timestamp: -1 });

    return NextResponse.json(
      { success: true, participations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching volunteer participations:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching volunteer participations", error: error.message },
      { status: 500 }
    );
  }
}

