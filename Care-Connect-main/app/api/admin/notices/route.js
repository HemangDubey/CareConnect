import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notice from "@/models/Notice";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
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
    return { success: true, adminId: decoded.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GET /api/admin/notices -> list all notices (admin only)
export async function GET(req) {
  const auth = verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  await dbConnect();

  const notices = await Notice.find({})
    .sort({ priority: 1, createdAt: 1 })
    .lean();

  return NextResponse.json({ notices });
}

// POST /api/admin/notices -> create notice
export async function POST(req) {
  const auth = verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  await dbConnect();

  const body = await req.json();

  const {
    title,
    body: contentBody,
    startDate,
    endDate,
    enabled = true,
    displayType = "every_visit",
    dismissible = true,
    priority = 0,
    target,
  } = body;

  if (!title || !contentBody || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const notice = await Notice.create({
    title,
    body: contentBody,
    startDate,
    endDate,
    enabled,
    displayType,
    dismissible,
    priority,
    target,
    createdBy: auth.adminId,
  });

  return NextResponse.json({ notice }, { status: 201 });
}



