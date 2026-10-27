import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

import Request from "@/models/Request";
import { verifyToken } from "@/lib/authMiddleware";

export async function POST(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { itemId, message } = await req.json();
    if (!itemId || !message) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const newRequest = await Request.create({
      adminId: decoded.id,
      itemId,
      message,
    });

    return NextResponse.json(
      { message: "Request created successfully", data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const adminId = url.searchParams.get("adminId");
    const itemId = url.searchParams.get("itemId");

    const filter = {};
    if (adminId) filter.adminId = adminId;
    if (itemId) filter.itemId = itemId;

    const requests = await Request.find(filter)
      .populate("adminId", "name email")
      .populate("itemId", "title description");

    return NextResponse.json({ data: requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
