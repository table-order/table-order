import { NextResponse } from "next/server";

const widgetSecretKey = process.env.NEXT_PUBLIC_WIDGET_SECRET_KEY;

const encryptedWidgetSecretKey =
  "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

export async function POST(req: Request) {
  try {
    const { paymentKey, orderId, amount } = await req.json();

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: encryptedWidgetSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          paymentKey,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      // 결제 승인 실패 시
      return NextResponse.json(result, { status: response.status });
    }

    // 결제 완료 시
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
