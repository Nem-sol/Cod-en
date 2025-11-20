import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { tx_ref, method } = await req.json();

    if (!tx_ref) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    // Verify Flutterwave
    if (method === "flutterwave") {
      const res = await fetch(
        `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
        { headers: { Authorization: `Bearer ${process.env.FLW_SECRET}` } }
      );

      const data = await res.json();

      if (data?.status === "success" && data.data?.status === "successful") {
        // Save to database here if needed

        return NextResponse.json({ success: true, message: "Payment successful" });
      }

      return NextResponse.json({ success: false, message: "Payment failed" });
    }

    // Verify Paystack
    if (method === "paystack") {
      const res = await fetch(
        `https://api.paystack.co/transaction/verify/${tx_ref}`,
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
      );

      const data = await res.json();

      if (data.status && data.data?.status === "success") {
        // Save to database
        return NextResponse.json({ success: true, message: "Payment successful" });
      }

      return NextResponse.json({ success: false, message: "Payment failed" });
    }

    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }
  catch (err) {
    console.log("VERIFY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}