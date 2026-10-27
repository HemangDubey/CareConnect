import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Home from "@/models/Home";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type");
    const location = searchParams.get("location");

    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };

    const homes = await Home.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: homes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
