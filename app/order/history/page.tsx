"use client";

import OrderHistory from "@/app/components/OrderHistory";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <>
      <article className="p-6 mb-[112px]">
        <div className="flex flex-col">
          <span className="text-[28px] font-bold text-tossgray-900">
            주문 내역
          </span>
          <span className="text-15 font-normal text-[#f04452]">
            나갈 때 직접 결제, 잊지 마세요.
          </span>
        </div>
        <OrderHistory />
      </article>
      <div className="fixed left-0 right-0 bottom-0 p-6 h-[112px] flex justify-center items-center bg-white z-50">
        <button className="py-4 w-full text-17 font-semibold text-xl text-white text-center rounded-2xl bg-tossblue-500 max-w-md">
          <Link href="/" className="flex gap-2 justify-center items-center">
            메뉴판으로
          </Link>
        </button>
      </div>
    </>
  );
}
