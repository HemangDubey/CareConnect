import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Home from "@/models/Home";

export async function POST(req) {
  try {
    await dbConnect();

    // Parse FormData
    const formData = await req.formData();
    
    const homeId = formData.get('homeId');
    const category = formData.get('category');
    const itemName = formData.get('itemName');
    const description = formData.get('description');
    const quantity = formData.get('quantity');
    const pickupAddress = formData.get('pickupAddress');
    const donorName = formData.get('donorName');
    const donorEmail = formData.get('donorEmail');
    const imageFile = formData.get('image');

    // Validate required fields
    if (!homeId || !category || !itemName || !description || !quantity || !pickupAddress) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Verify home exists
    const home = await Home.findById(homeId);
    if (!home) {
      return NextResponse.json(
        { success: false, message: "Home not found" },
        { status: 404 }
      );
    }

    // Handle image upload - convert to base64 if provided
    let imageUrl = null;
    if (imageFile && imageFile instanceof File) {
      // Convert file to base64
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = imageFile.type;
      imageUrl = `data:${mimeType};base64,${base64}`;
      
      // Note: For production, consider using a file storage service like Cloudinary, AWS S3, etc.
      // This base64 approach works but can make the database large
    }

    // Create donation
    const donation = await Donation.create({
      homeId,
      category,
      itemName,
      description,
      quantity: parseInt(quantity),
      pickupAddress,
      donorName: donorName || 'Anonymous',
      donorEmail: donorEmail || '',
      imageUrl,
      status: 'Pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: "Donation submitted successfully",
        donation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { success: false, message: "Error creating donation", error: error.message },
      { status: 500 }
    );
  }
}

