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

// PUT /api/admin/notices/[id] -> update notice
export async function PUT(req, { params }) {
  const auth = verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  await dbConnect();

  const { id } = params;
  const data = await req.json();

  data.updatedAt = new Date();

  const notice = await Notice.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!notice) {
    return NextResponse.json({ error: "Notice not found" }, { status: 404 });
  }

  return NextResponse.json({ notice });
}

// PATCH /api/admin/notices/[id] -> toggle enable or partial update
export async function PATCH(req, { params }) {
  const auth = verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  await dbConnect();

  const { id } = params;
  const data = await req.json();

  if ("enabled" in data) {
    const notice = await Notice.findByIdAndUpdate(
      id,
      { enabled: data.enabled, updatedAt: new Date() },
      { new: true }
    );

    if (!notice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ notice });
  }

  data.updatedAt = new Date();

  const notice = await Notice.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!notice) {
    return NextResponse.json({ error: "Notice not found" }, { status: 404 });
  }

  return NextResponse.json({ notice });
}

// DELETE /api/admin/notices/[id] -> delete notice
export async function DELETE(req, { params }) {
  const auth = verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  await dbConnect();

  const { id } = params;

  const deleted = await Notice.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Notice not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}



