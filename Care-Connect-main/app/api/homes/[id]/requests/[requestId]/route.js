/**
 * API Route: /api/homes/[id]/requests/[requestId]
 *
 * Handles updating and deleting individual requests that belong to a home
 */

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Request from "@/models/Request";
import HomeAdmin from "@/models/HomeAdmin";
import { verifyHomeAdmin } from "@/lib/authMiddleware";

const ALLOWED_STATUSES = ["active", "completed"];

async function authorizeHomeAdmin(request, homeId) {
  const authResult = verifyHomeAdmin(request);
  if (!authResult.success) {
    return { success: false, response: NextResponse.json({ success: false, message: authResult.error }, { status: 401 }) };
  }

  const homeAdmin = await HomeAdmin.findById(authResult.adminId);
  if (!homeAdmin || homeAdmin.home.toString() !== homeId) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized to manage requests for this home" },
        { status: 403 }
      ),
    };
  }

  return { success: true };
}

export async function PUT(request, context) {
  try {
    await dbConnect();
    const { id, requestId } = await context.params; // homeId, requestId

    const auth = await authorizeHomeAdmin(request, id);
    if (!auth.success) return auth.response;

    const payload = await request.json();
    const { title, description, status } = payload;

    const requestDoc = await Request.findOne({ _id: requestId, homeId: id });
    if (!requestDoc) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    if (title) requestDoc.title = title;
    if (description) requestDoc.description = description;
    if (status) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status value" },
          { status: 400 }
        );
      }
      requestDoc.status = status;
    }

    await requestDoc.save();

    return NextResponse.json(
      { success: true, message: "Request updated successfully", request: requestDoc },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating request", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();
    const { id, requestId } = await context.params;

    const auth = await authorizeHomeAdmin(request, id);
    if (!auth.success) return auth.response;

    const requestDoc = await Request.findOne({ _id: requestId, homeId: id });
    if (!requestDoc) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    await requestDoc.deleteOne();

    return NextResponse.json(
      { success: true, message: "Request deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error deleting request", error: error.message },
      { status: 500 }
    );
  }
}

