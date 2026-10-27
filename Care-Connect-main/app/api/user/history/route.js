import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import VolunteerParticipation from "@/models/VolunteerParticipation";
import VolunteerRequest from "@/models/VolunteerRequest";
import Payment from "@/models/Payment";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Helper to verify user token (aligned with existing patterns)
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
    // Also try decoding NextAuth-style tokens without verification
    try {
      const token = req.headers.get("authorization")?.split(" ")[1];
      if (token) {
        const decoded = jwt.decode(token);
        if (decoded && decoded.sub) {
          return {
            success: true,
            userId: decoded.sub,
            email: decoded.email,
            name: decoded.name,
          };
        }
      }
    } catch {
      // ignore secondary decoding errors
    }
    return { success: false, error: error.message };
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const authResult = verifyUserToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: "Authentication required", error: authResult.error },
        { status: 401 }
      );
    }

    const tokenUserId = authResult.userId;
    const tokenEmail = authResult.email;

    // Resolve to an actual User document so we can reliably query by ObjectId
    let user = null;

    if (tokenUserId && mongoose.isValidObjectId(tokenUserId)) {
      user = await User.findById(tokenUserId);
    }

    if (!user && tokenEmail) {
      user = await User.findOne({ email: tokenEmail });
    }

    if (!user && tokenEmail) {
      // As in other APIs, create a user record on the fly for external providers
      user = await User.create({
        name: authResult.name || "User",
        email: tokenEmail,
        provider: "google",
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const actualUserId = user._id.toString();
    const userEmail = user.email;

    // --- Donations: mirror existing /api/user/donations behaviour ---
    const donations = await Donation.find({ donorEmail: userEmail })
      .populate("homeId", "name location type")
      .sort({ createdAt: -1 });

    // --- Volunteer activity: mirror /api/volunteer-participation?userId= ---
    const volunteers = await VolunteerParticipation.find({
      userId: actualUserId,
    })
      .populate("userId", "name email image")
      .populate({
        path: "volunteerRequestId",
        populate: {
          path: "homeId",
          select: "name location",
        },
      })
      .sort({ timestamp: -1 });

    // --- Payments: all Razorpay transactions linked to this user ---
    const payments = await Payment.find({ userId: actualUserId })
      .populate({
        path: "donationId",
        select: "itemName category homeId",
        populate: {
          path: "homeId",
          select: "name location",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        donations,
        volunteers,
        payments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching user history",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

