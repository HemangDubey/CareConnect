import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomeAdmin from "@/models/HomeAdmin";
import Home from "@/models/Home";
import bcrypt from "bcryptjs";

// Update home admin by ID
export async function PUT(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await req.json();

    // Check if home admin exists
    const existingAdmin = await HomeAdmin.findById(id);
    if (!existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Home admin not found" },
        { status: 404 }
      );
    }

    // If email is being updated, check if new email already exists
    if (body.email && body.email !== existingAdmin.email) {
      const emailExists = await HomeAdmin.findOne({ email: body.email });
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // If homeId is being updated, verify the home exists
    if (body.homeId) {
      const homeExists = await Home.findById(body.homeId);
      if (!homeExists) {
        return NextResponse.json(
          { success: false, error: "Home not found" },
          { status: 404 }
        );
      }
    }

    // Prepare update data
    const updateData = { ...body };

    // Hash password if it's being updated
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    // Use homeId instead of home for the update
    if (body.homeId) {
      updateData.home = body.homeId;
      delete updateData.homeId;
    }

    const updatedAdmin = await HomeAdmin.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("home", "name location type");

    // Exclude password from response
    const adminResponse = updatedAdmin.toObject();
    delete adminResponse.password;

    return NextResponse.json(
      { success: true, data: adminResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating home admin:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Delete home admin by ID
export async function DELETE(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const deletedAdmin = await HomeAdmin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return NextResponse.json(
        { success: false, error: "Home admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Home admin deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting home admin:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

