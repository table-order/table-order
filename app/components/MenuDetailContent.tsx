"use client";

import { useState } from "react";
import { useCartStore } from "../store/store";
import { useRouter } from "next/navigation";
import FixedBottomCTA from "./FixedBottomCTA";

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
  const { addToCart } = useCartStore();
  const router = useRouter();

  const menuPrice = `${(amount * menu.price).toLocaleString()}`;

  const handleAddToCart = () => {
    addToCart({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: amount,
    });
    router.push("/");
  };
  return (
    <div>
      <div className="flex flex-col gap-8 p-6 ">
        <div>
          <h2 className="font-bold text-tossgray-900 text-22">{menu.name}</h2>
          <p className="text-17 text-tossgray-600 font-medium">
            {menu.description}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {discountedPrice !== null ? (
              <>
                <p className="line-through text-gray-400 font-bold">
                  {menuPrice}원
                </p>
                <p className="text-2xl text-tossgray-800 font-bold">10,000원</p>
              </>
            ) : (
              <p className="text-2xl text-tossgray-800 font-bold">
                {menuPrice}원
              </p>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  className={`size-5 ${
                    amount <= 1 ? "stroke-gray-300" : "stroke-gray-500"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-center bg-white font-semibold text-gray-600 text-lg px-6 py-2 my-1 rounded-xl shadow w-12">
              {amount}
            </div>
            <div className="flex items-center p-3 rounded-xl ">
              <button onClick={() => setAmount(amount + 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  className="size-5 stroke-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <FixedBottomCTA
          onClick={handleAddToCart}
          amount={amount}
          menuPrice={menuPrice}
        />
      </div>
    </div>
  );
}
