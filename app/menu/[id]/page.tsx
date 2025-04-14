"use client";

import CustomButton from "@/app/components/CustomButton";
import Image from "next/image";
import burgerImg from "../../../public/images/burger.jpg";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export default function MenuDetailPage() {
  const [amount, setAmount] = useState(1);
  const discountedPrice = null;

  const menuPrice = `${(amount * 11500).toLocaleString()}`;
  return (
    <div>
      <div className="relative w-full h-80">
        <Image src={burgerImg} alt="burger" fill />
      </div>

      <div className="flex flex-col gap-8 p-6 ">
        <div>
          <h2 className="font-bold text-xl">
            POST PREMIUM 오리지날 치즈 버거(단품)
          </h2>
          <p className="text-gray-400 font-bold">단품 : 햄버거</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {discountedPrice !== null ? (
              <>
                <p className="line-through text-gray-400 font-bold">11,500원</p>
                <p className="text-2xl font-bold">10,000원</p>
              </>
            ) : (
              <p className="text-2xl font-bold">11,500원</p>
            )}
          </div>
          <div className="flex  bg-gray-100 rounded-xl">
            <div className="flex items-center p-3 rounded-xl ">
              <button
                onClick={() => {
                  if (amount <= 1) {
                    return;
                  }
                  setAmount(amount - 1);
                }}
              >
                <MinusIcon className="size-4 text-gray-500" />
              </button>
            </div>
            <div className="flex justify-center bg-white font-semibold text-gray-600 text-lg px-6 py-2 my-1 rounded-xl shadow-xs w-12">
              {amount}
            </div>
            <div className="flex items-center p-3 rounded-xl ">
              <button onClick={() => setAmount(amount + 1)}>
                <PlusIcon className="size-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        <CustomButton>
          <div className="flex gap-2 justify-center items-center">
            <p className="px-3 py-1 rounded-[11px] text-blue-500 bg-white text-center">
              {amount}
            </p>
            <p className="font-bold">{menuPrice}원</p>
            <p className="font-bold">담기</p>
          </div>
        </CustomButton>
      </div>
    </div>
  );
}
