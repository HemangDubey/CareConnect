
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Home from "@/models/Home";

// Update home details by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    const updatedHome = await Home.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedHome) {
      return NextResponse.json({ error: "Home not found" }, { status: 404 });
    }

    return NextResponse.json(updatedHome, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Delete home by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } =await params;
    const deletedHome = await Home.findByIdAndDelete(id);

    if (!deletedHome) {
      return NextResponse.json({ success: false, error: "Home not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Home deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
