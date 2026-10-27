// file: app/api/homes/[id]/notices/route.js
// GET: List active notices for a home (public)
// POST: Create notice for home (admin-auth required)

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeNotice from "@/models/HomeNotice";
import NoticeDismissal from "@/models/NoticeDismissal";
import Home from "@/models/Home";

// GET /api/homes/[id]/notices
// Public endpoint - returns active notices for a home
// Query params: userId (optional) - if provided, filters out showOnce notices already dismissed
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Verify home exists
    const home = await Home.findById(id);
    if (!home) {
      return NextResponse.json(
        { success: false, error: "Home not found" },
        { status: 404 }
      );
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || null;
    const adminView = searchParams.get("admin") === "true"; // Admin can see all notices

    const now = new Date();

    // Build query - admin view shows all notices, public view only active ones
    let query = { homeId: id };
    
    if (!adminView) {
      // Public view: only enabled notices within date range
      query.enabled = true;
      query.$and = [
        {
          $or: [
            { startAt: null },
            { startAt: { $lte: now } },
          ],
        },
        {
          $or: [
            { endAt: null },
            { endAt: { $gte: now } },
          ],
        },
      ];
    }

    let notices = await HomeNotice.find(query)
      .sort({ createdAt: -1 }) // newest first
      .lean();
    
    // Sort by priority: high > medium > low (custom sort since priority is string)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    notices.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    // If userId provided, filter out showOnce notices that were already dismissed
    if (userId) {
      const dismissedNoticeIds = await NoticeDismissal.find({
        noticeId: { $in: notices.map(n => n._id) },
        userId: userId,
      }).distinct("noticeId");

      notices = notices.filter(
        (notice) => !notice.showOnce || !dismissedNoticeIds.includes(notice._id)
      );
    }

    return NextResponse.json({
      success: true,
      notices: notices,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/homes/[id]/notices
// Admin-auth required - create a new notice for a home
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // TODO: admin-auth required - verify admin session/token here
    // const adminId = await verifyAdminAuth(req);
    // if (!adminId) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    // Verify home exists
    const home = await Home.findById(id);
    if (!home) {
      return NextResponse.json(
        { success: false, error: "Home not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { title, content, startAt, endAt, priority, showOnce, enabled, createdBy } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Validate priority
    if (priority && !["high", "medium", "low"].includes(priority)) {
      return NextResponse.json(
        { success: false, error: "Priority must be high, medium, or low" },
        { status: 400 }
      );
    }

    // Validate dates - use timezone-aware dates
    let startDate = null;
    let endDate = null;
    if (startAt) {
      startDate = new Date(startAt);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid startAt date" },
          { status: 400 }
        );
      }
    }
    if (endAt) {
      endDate = new Date(endAt);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid endAt date" },
          { status: 400 }
        );
      }
      // Validate endAt is after startAt
      if (startDate && endDate <= startDate) {
        return NextResponse.json(
          { success: false, error: "endAt must be after startAt" },
          { status: 400 }
        );
      }
    }

    // For now, use createdBy from body or default to a placeholder
    // In production, extract from authenticated admin session
    const creatorId = createdBy || "admin-placeholder"; // TODO: replace with actual admin ID from auth

    const notice = await HomeNotice.create({
      homeId: id,
      title: title.trim(),
      content: content.trim(),
      startAt: startDate,
      endAt: endDate,
      priority: priority || "medium",
      showOnce: showOnce || false,
      enabled: enabled !== undefined ? enabled : true,
      createdBy: creatorId,
    });

    return NextResponse.json(
      { success: true, notice: notice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

