import mongoose from "mongoose";
import connect from "@/src/utils/db";
import { NextResponse } from "next/server";
import Payment from "@/src/models/Payments";
import { FirstCase } from "@/src/components/functions";

type Pay = {
  _id: string
  type: string
  email: string
  amount: string
  status: string
  method: string
  provider: string
  currency: string
  reference: string
  createdAt: string
  updatedAt: string
  description: string
  userId: string | null
  targetId: string | null
  phoneNumber: string | null
}

export async function POST(req: Request) {
  try {
    await connect();

    const { amount, email, number, desc, currency: money, name, provider, method, userId, targetId } =
      await req.json();

    const type = "gift"
    const currency = money || 'NGN'
    const reference = "Cod-en-" + Date.now();
    const description = desc || `${FirstCase(provider)} ${type} payment from ${name || 'Guest'}`

    if (!email || !amount ) return NextResponse.json({ error: "Complete all required fields" }, { status: 400 })

    if (type !== 'gift' && !mongoose.Types.ObjectId.isValid(targetId)) return NextResponse.json({ error: `Invalid ${type} Id` }, { status: 400 })

    if (!['flutterwave', 'paystack'].includes(provider.toLowerCase())) return NextResponse.json({ error: "Payment provider is not available yet" }, { status: 400 });

    // Create DB record
    const payment = await Payment.create({
      type,
      email,
      userId,
      method,
      amount,
      targetId,
      provider,
      currency,
      reference,
      description,
      status: "Pending",
      phoneNumber: number
    });

    if (!payment) return NextResponse.json({ error: "Error occured before payment started. Try again" }, { status: 400 })

    // FLUTTERWAVE
    else if (provider === "flutterwave") {
      const flw = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          tx_ref: reference,
          customer: { email },
          redirect_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/verify?provider=flutterwave`,
        }),
      });

      const result = await flw.json();
      return NextResponse.json({ link: result.data.link });
    }

    // PAYSTACK
    else if (provider === "paystack") {
      const stack = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/verify?provider=paystack`,
        }),
      });

      const result = await stack.json();
      return NextResponse.json({ link: result.data.authorization_url });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error occured while making payment. Try again" }, { status: 500 })
  }
}

