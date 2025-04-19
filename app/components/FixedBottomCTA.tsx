"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/store";
import { useRouter } from "next/navigation";

type FixedBottomCTAProps = {
  amount?: number;
  menuPrice?: string;
  onClick?: () => void;
  defaultRoute?: string;
  buttonText?: string;
};

export default function FixedBottomCTA({
  amount,
  menuPrice,
  onClick,
  defaultRoute = "/cart",
  buttonText = "담기",
}: FixedBottomCTAProps) {
  const router = useRouter();
  const [displayAmount, setDisplayAmount] = useState(amount || 0);
  const [displayPrice, setDisplayPrice] = useState(menuPrice || "0");
  const [shouldRender, setShouldRender] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    // 클라이언트에서만 상태를 업데이트
    setDisplayAmount(amount !== undefined ? amount : totalItems);
    setDisplayPrice(
      menuPrice !== undefined ? menuPrice : totalPrice.toLocaleString()
    );

    // 클라이언트에서만 조건부 렌더링을 결정
    if (amount === undefined && totalItems === 0) {
      setShouldRender(false);
    } else {
      setShouldRender(true); // 상태가 업데이트되면 렌더링
    }
  }, [amount, menuPrice, totalItems, totalPrice]);

  // onClick이 제공되지 않으면 기본 동작
  const handleClick = onClick || (() => router.push(defaultRoute));

  // shouldRender가 false이면 버튼을 완전히 숨김
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 bottom-0 p-6 h-[112px] flex justify-center items-center bg-white z-49">
      <button
        onClick={handleClick}
        className="py-3 w-full font-semibold text-xl text-white text-center rounded-2xl bg-tossblue-500 max-w-md animate-custom animate-duration-[1s] animate-ease-[cubic-bezier(0.25,0.1,0.25,1)]"
      >
        <div className="flex gap-2 justify-center items-center">
          <p className="px-2.5 mr-1 py-0.5 rounded-[11px] text-17 font-bold text-tossblue-500 bg-white">
            {displayAmount}
          </p>
          <p className="font-bold text-[19px]">{displayPrice}원</p>
          <p className="font-bold text-[19px]">{buttonText}</p>
        </div>
      </button>
    </div>
  );
}
