// file: app/api/requests/[id]/upload-qr/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Request from "@/models/Request";
import { writeFile, mkdir } from "fs/promises";
import { join, resolve } from "path";

export const dynamic = "force-dynamic";

// POST /api/requests/[id]/upload-qr - Upload QR image (admin auth required)
export async function POST(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // Get form data
    const formData = await req.formData();
    const file = formData.get("qrImage");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "QR image file is required" },
        { status: 400 }
      );
    }

    // Validate file type (PNG, JPG, SVG)
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only PNG, JPG, or SVG allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 2MB" },
        { status: 400 }
      );
    }

    // Find request
    const request = await Request.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    // Store file in /mnt/data/uploads (or public/uploads for local dev)
    const defaultPath = process.platform === 'win32' 
      ? resolve(process.cwd(), 'public', 'uploads')
      : '/mnt/data/uploads';
    const storagePath = process.env.UPLOAD_STORAGE_PATH || defaultPath;
    
    const fileExtension = file.name.split(".").pop() || "png";
    const fileName = `qr_${id}_${Date.now()}.${fileExtension}`;
    const filePath = resolve(storagePath, fileName);

    // Ensure directory exists
    try {
      await mkdir(storagePath, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate URL - use /api/files/ for serving or /uploads/ for static
    const qrImageUrl = `/api/files/${fileName}`;

    // Update request with QR image URL
    request.upi = request.upi || {};
    request.upi.qrImageUrl = qrImageUrl;
    await request.save();

    return NextResponse.json(
      { success: true, data: request, qrImageUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading QR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



