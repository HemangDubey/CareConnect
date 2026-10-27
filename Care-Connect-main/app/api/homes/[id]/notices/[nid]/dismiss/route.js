// file: app/api/homes/[id]/notices/[nid]/dismiss/route.js
// POST: Record dismissal for a user (public)

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeNotice from "@/models/HomeNotice";
import NoticeDismissal from "@/models/NoticeDismissal";

// POST /api/homes/[id]/notices/[nid]/dismiss
// Public endpoint - record that a user dismissed a notice
// Body: { userId?: string } - optional userId, or use session/cookie token
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id, nid } = await params;

    // Verify notice exists and belongs to this home
    const notice = await HomeNotice.findOne({ _id: nid, homeId: id });
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "Notice not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    let userId = body.userId || null;

    // TODO: Extract userId from session/cookie token if not provided
    // const session = await getSession(req);
    // if (!userId && session?.user?.id) {
    //   userId = session.user.id;
    // }

    // For anonymous users, generate a client token or use sessionId
    // For now, accept userId from body or use a generated token
    if (!userId) {
      // Generate a simple client token for anonymous users
      // In production, use a proper session ID or cookie-based token
      userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Check if already dismissed (prevent duplicates)
    const existingDismissal = await NoticeDismissal.findOne({
      noticeId: nid,
      userId: userId,
    });

    if (existingDismissal) {
      return NextResponse.json({
        success: true,
        message: "Notice already dismissed",
      });
    }

    // Create dismissal record
    await NoticeDismissal.create({
      noticeId: nid,
      userId: userId,
      homeId: id,
      dismissedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Notice dismissed successfully",
    });
  } catch (error) {
    console.error("Error dismissing notice:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

