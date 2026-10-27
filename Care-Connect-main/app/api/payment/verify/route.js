import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Missing Razorpay configuration. Please set RAZORPAY_KEY_SECRET."
  );
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      metadata = {},
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification details" },
        { status: 400 }
      );
    }

    // Verify signature using order_id and payment_id
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update or create the payment as captured on successful verification
    const payment = await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        signature: razorpay_signature,
        status: "captured",
        ...(Object.keys(metadata).length ? { metadata } : {}),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        payment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying payment" },
      { status: 500 }
    );
  }
}

