"use client";

import { useCartStore } from "@/app/store/store";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const orderHistory = useCartStore((state) => state.getOrderHistory());

  // 전체 주문 수량 계산
  const totalItems = orderHistory.reduce(
    (total, order) =>
      total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  const totalPrice = orderHistory
    .reduce((total, order) => total + order.totalPrice, 0)
    .toLocaleString();

  const [displayTotalItems, setDisplayAmount] = useState(totalItems || 0);
  const [displayTotalPrice, setDisplayPrice] = useState(totalPrice || "0");
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (totalItems !== undefined && totalPrice !== undefined) {
      setDisplayAmount(totalItems);
      setDisplayPrice(totalPrice);
      setShouldRender(true);
    } else {
      setShouldRender(false);
    }
  }, [totalItems, totalPrice]);

  if (!shouldRender) {
    return null;
  }

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

        {totalItems === 0 ? (
          <div className="pt-6">
            <span className="font-medium text-17 text-tossgray-500">
              아직 주문 내역이 없어요
            </span>
          </div>
        ) : (
          <>
            <div className="pt-6">
              <span className="text-22 font-bold text-tossgray-900">
                {displayTotalItems}개 | {displayTotalPrice}원
              </span>
            </div>
            {orderHistory.map((order, index) => {
              const totalItems = order.items.reduce(
                (total, item) => total + item.quantity,
                0
              );
              return (
                <div key={order.id}>
                  <div className="flex justify-between mt-6 mb-5">
                    <span className="text-tossgray-800 text-17 font-bold">
                      {index === 0 ? "최근" : "이전"} 주문 내역 ({totalItems}개)
                    </span>
                    <span className="text-tossgray-700 text-15">
                      {order.orderTime}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {order.items.map((item) => (
                      <div className="flex flex-col" key={item.id}>
                        <span
                          key={item.id}
                          className="text-tossgray-800 font-bold text-17"
                        >
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-15 text-tossgray-700">
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                  {index !== orderHistory.length - 1 ? (
                    <hr className="my-6 text-tossgray-400" />
                  ) : null}
                </div>
              );
            })}
          </>
        )}
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
