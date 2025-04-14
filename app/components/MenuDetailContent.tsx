"use client";

import CustomButton from "@/app/components/CustomButton";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";

type MenuDetailContentProps = {
  menu: {
    id: number;
    name: string;
    price: number;
    description?: string;
    imageUrl: string;
    category: string;
  };
};

export default function MenuDetailContent({ menu }: MenuDetailContentProps) {
  const [amount, setAmount] = useState(1);
  const discountedPrice = null;

  const menuPrice = `${(amount * menu.price).toLocaleString()}`;
  return (
    <div>
      <div className="flex flex-col gap-8 p-6 ">
        <div>
          <h2 className="font-bold text-xl">{menu.name}</h2>
          <p className="text-gray-400 font-bold">{menu.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {discountedPrice !== null ? (
              <>
                <p className="line-through text-gray-400 font-bold">
                  {menuPrice}원
                </p>
                <p className="text-2xl font-bold">10,000원</p>
              </>
            ) : (
              <p className="text-2xl font-bold">{menuPrice}원</p>
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
                <MinusIcon className="size-4 font-semibold text-gray-500" />
              </button>
            </div>
            <div className="flex justify-center bg-white font-semibold text-gray-600 text-lg px-6 py-2 my-1 rounded-xl shadow-xs w-12">
              {amount}
            </div>
            <div className="flex items-center p-3 rounded-xl ">
              <button onClick={() => setAmount(amount + 1)}>
                <PlusIcon className="size-4  text-gray-500" />
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
