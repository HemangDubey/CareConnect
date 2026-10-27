import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function verifyHomeAdmin(req) {
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
    if (decoded.role !== "home-admin" && decoded.role !== "homeAdmin") {
      return { success: false, error: "Unauthorized role" };
    }

    return { success: true, adminId: decoded.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
