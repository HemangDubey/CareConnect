// file: app/api/homes/[id]/notices/[nid]/route.js
// PUT: Update notice (admin-auth required)
// DELETE: Delete notice (admin-auth required)

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeNotice from "@/models/HomeNotice";
import NoticeDismissal from "@/models/NoticeDismissal";

// PUT /api/homes/[id]/notices/[nid]
// Admin-auth required - update a notice
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id, nid } = await params;

    // TODO: admin-auth required
    // const adminId = await verifyAdminAuth(req);
    // if (!adminId) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    const notice = await HomeNotice.findOne({ _id: nid, homeId: id });
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "Notice not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { title, content, startAt, endAt, priority, showOnce, enabled } = body;

    // Validate priority if provided
    if (priority && !["high", "medium", "low"].includes(priority)) {
      return NextResponse.json(
        { success: false, error: "Priority must be high, medium, or low" },
        { status: 400 }
      );
    }

    // Validate dates
    let startDate = notice.startAt;
    let endDate = notice.endAt;
    if (startAt !== undefined) {
      if (startAt === null) {
        startDate = null;
      } else {
        startDate = new Date(startAt);
        if (isNaN(startDate.getTime())) {
          return NextResponse.json(
            { success: false, error: "Invalid startAt date" },
            { status: 400 }
          );
        }
      }
    }
    if (endAt !== undefined) {
      if (endAt === null) {
        endDate = null;
      } else {
        endDate = new Date(endAt);
        if (isNaN(endDate.getTime())) {
          return NextResponse.json(
            { success: false, error: "Invalid endAt date" },
            { status: 400 }
          );
        }
        if (startDate && endDate <= startDate) {
          return NextResponse.json(
            { success: false, error: "endAt must be after startAt" },
            { status: 400 }
          );
        }
      }
    }

    // Update fields
    if (title !== undefined) notice.title = title.trim();
    if (content !== undefined) notice.content = content.trim();
    if (startAt !== undefined) notice.startAt = startDate;
    if (endAt !== undefined) notice.endAt = endDate;
    if (priority !== undefined) notice.priority = priority;
    if (showOnce !== undefined) notice.showOnce = showOnce;
    if (enabled !== undefined) notice.enabled = enabled;

    await notice.save();

    return NextResponse.json({
      success: true,
      notice: notice,
    });
  } catch (error) {
    console.error("Error updating notice:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/homes/[id]/notices/[nid]
// Admin-auth required - delete a notice
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id, nid } = await params;

    // TODO: admin-auth required
    // const adminId = await verifyAdminAuth(req);
    // if (!adminId) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    const notice = await HomeNotice.findOne({ _id: nid, homeId: id });
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "Notice not found" },
        { status: 404 }
      );
    }

    // Delete associated dismissals
    await NoticeDismissal.deleteMany({ noticeId: nid });

    // Delete the notice
    await HomeNotice.findByIdAndDelete(nid);

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

