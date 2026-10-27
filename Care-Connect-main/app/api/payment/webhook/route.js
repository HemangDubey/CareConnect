import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error(
    "Missing Razorpay webhook configuration. Please set RAZORPAY_WEBHOOK_SECRET."
  );
}

export async function POST(req) {
  // Razorpay sends the signature in this header
  const signature =
    req.headers.get("x-razorpay-signature") ||
    req.headers.get("X-Razorpay-Signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, message: "Razorpay signature missing" },
      { status: 400 }
    );
  }

  // Read the raw body for signature verification
  const body = await req.text();

  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Razorpay webhook signature mismatch");
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("Invalid webhook JSON:", error);
    return NextResponse.json(
      { success: false, message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const eventType = event.event;

    // We primarily care about successful payments
    if (eventType === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;

      if (!paymentEntity) {
        console.error("Payment entity missing in webhook payload");
        return NextResponse.json(
          { success: false, message: "Payment entity missing" },
          { status: 400 }
        );
      }

      const {
        id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount,
        currency,
        notes = {},
      } = paymentEntity;

      // Convert amount from smallest unit (paise) back to rupees
      const amountInRupees = amount / 100;

      // Safely extract optional linkage information from notes/metadata
      const relatedUserId =
        notes.userId || notes.user_id || notes.user || null;
      const relatedDonationId =
        notes.donationId || notes.donation_id || null;

      // Upsert payment record: this both stores the payment and
      // marks the donation/payment as completed (status: 'captured')
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        {
          amount: amountInRupees,
          currency,
          status: "captured",
          razorpay_order_id,
          razorpay_payment_id,
          signature,
          razorpay_signature: signature,
          ...(relatedUserId ? { userId: relatedUserId } : {}),
          ...(relatedDonationId ? { donationId: relatedDonationId } : {}),
          metadata: notes,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    // Always return 200 for verified webhooks to avoid repeated retries
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    return NextResponse.json(
      { success: false, message: "Error processing webhook" },
      { status: 500 }
    );
  }
}

