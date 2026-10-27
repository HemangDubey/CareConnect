import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notice from "@/models/Notice";
import NoticeSeen from "@/models/NoticeSeen";
import jwt from "jsonwebtoken";

// Helper: extract userId from Authorization bearer token if present
function getUserIdFromRequest(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || decoded.userId || null;
  } catch {
    return null;
  }
}

// GET /api/notices -> fetch active notices for current user
export async function GET(req) {
  await dbConnect();

  const now = new Date();
  const userId = getUserIdFromRequest(req);

  const notices = await Notice.find({
    enabled: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .sort({ priority: 1, createdAt: 1 })
    .lean();

  let seenMap = {};

  if (userId) {
    const seen = await NoticeSeen.find({
      userId,
      noticeId: { $in: notices.map((n) => n._id) },
    }).lean();

    seenMap = seen.reduce((acc, s) => {
      acc[s.noticeId.toString()] = true;
      return acc;
    }, {});
  }

  const result = notices.map((n) => {
    const isOneTime = n.displayType === "one_time";
    const seen = isOneTime && seenMap[n._id.toString()];

    return {
      id: n._id,
      title: n.title,
      body: n.body,
      startDate: n.startDate,
      endDate: n.endDate,
      enabled: n.enabled,
      displayType: n.displayType,
      dismissible: n.dismissible,
      priority: n.priority,
      shouldDisplay: n.enabled && (!isOneTime || !seen),
    };
  });

  return NextResponse.json({ notices: result });
}

// POST /api/notices/seen -> mark a one_time notice as seen for current user
export async function POST(req) {
  await dbConnect();

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required to mark notice as seen" },
      { status: 401 }
    );
  }

  const { noticeId } = await req.json();
  if (!noticeId) {
    return NextResponse.json(
      { error: "noticeId is required" },
      { status: 400 }
    );
  }

  await NoticeSeen.updateOne(
    { userId, noticeId },
    { $setOnInsert: { userId, noticeId } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}


