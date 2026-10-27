import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Missing Razorpay configuration. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
  );
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", metadata = {} } = body;

    if (
      typeof amount !== "number" ||
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Convert amount in rupees to paise as Razorpay expects the smallest currency unit
    const amountInPaise = Math.round(amount * 100);

    await dbConnect();

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      payment_capture: 1,
      notes: {
        ...metadata,
      },
    });

    // Persist a payment record with "created" status for tracking
    await Payment.create({
      amount,
      currency,
      status: "created",
      razorpay_order_id: order.id,
      metadata,
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount, // amount in paise
        currency: order.currency,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to create payment order",
        // Do not leak sensitive error details in production
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

