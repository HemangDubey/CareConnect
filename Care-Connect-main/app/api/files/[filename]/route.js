// file: app/api/files/[filename]/route.js
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { resolve } from "path";

export const dynamic = "force-dynamic";

// GET /api/files/[filename] - Serve uploaded files (QR images)
export async function GET(req, context) {
  try {
    const { filename } = await context.params;
    
    // Security: Validate filename to prevent path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }
    
    // Simulate storage path /mnt/data/uploads
    const defaultPath = process.platform === 'win32' 
      ? resolve(process.cwd(), 'public', 'uploads')
      : '/mnt/data/uploads';
    const storagePath = process.env.UPLOAD_STORAGE_PATH || defaultPath;
    const filePath = resolve(storagePath, filename);
    
    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const extension = filename.split(".").pop()?.toLowerCase();
    const contentType = 
      extension === "png" ? "image/png" :
      extension === "jpg" || extension === "jpeg" ? "image/jpeg" :
      extension === "svg" ? "image/svg+xml" :
      "application/octet-stream";
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
}


