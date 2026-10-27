// file: app/api/admin/notices/analytics/route.js
// GET: Returns counts of views/dismissals (admin-auth required)

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeNotice from "@/models/HomeNotice";
import NoticeDismissal from "@/models/NoticeDismissal";

// GET /api/admin/notices/analytics?homeId=...
// Admin-auth required - returns analytics for notices
export async function GET(req) {
  try {
    await dbConnect();

    // TODO: admin-auth required
    // const adminId = await verifyAdminAuth(req);
    // if (!adminId) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const homeId = searchParams.get("homeId");

    if (!homeId) {
      return NextResponse.json(
        { success: false, error: "homeId query parameter is required" },
        { status: 400 }
      );
    }

    // Get all notices for this home
    const notices = await HomeNotice.find({ homeId }).lean();

    // Get dismissal counts per notice
    const dismissalCounts = await NoticeDismissal.aggregate([
      {
        $match: {
          noticeId: { $in: notices.map(n => n._id) },
        },
      },
      {
        $group: {
          _id: "$noticeId",
          count: { $sum: 1 },
        },
      },
    ]);

    const dismissalMap = {};
    dismissalCounts.forEach((item) => {
      dismissalMap[item._id.toString()] = item.count;
    });

    // Build analytics response
    const analytics = notices.map((notice) => ({
      noticeId: notice._id,
      title: notice.title,
      enabled: notice.enabled,
      dismissals: dismissalMap[notice._id.toString()] || 0,
      createdAt: notice.createdAt,
    }));

    return NextResponse.json({
      success: true,
      analytics: analytics,
      totalNotices: notices.length,
      totalDismissals: Object.values(dismissalMap).reduce((a, b) => a + b, 0),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

