"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/store";

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart, updateQuantity } =
    useCartStore();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(
      cartItems.reduce(
        (acc: number, item) => acc + item.quantity * item.price,
        0
      )
    );
  }, [cartItems]);

  return (
    <div id="container" className="px-6 pt-6 pb-4 font-sans">
      <h1 className="font-bold text-2xl my-8">장바구니</h1>
      <div id="myMenu">
        <p className="font-bold mb-5 text-xl">내 메뉴</p>
        {cartItems.map((item) => (
          <li key={item.id} className="flex items-center mb-5">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between text-lg font-medium text-gray-800">
                <span>{item.name}</span>
                <button type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    onClick={() => {
                      removeFromCart(item.id);
                    }}
                    className="size-10 fill-gray-400 hover:fill-gray-500 active:fill-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-lg font-semibold mb-4 text-gray-800">
                {item.price.toLocaleString()}원
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="hover:bg-gray-300 active:bg-gray-300 transition font-semibold rounded-lg bg-gray-100 text-gray-500 px-4 py-2"
                >
                  옵션 변경
                </button>
                <div
                  id="count-button-group"
                  className="flex items-center px-3 rounded-lg gap-1 bg-gray-100 text-gray-500"
                >
                  <button
                    type="button"
                    onClick={() => {
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                  >
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
                        d="M5 12h14"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      updateQuantity(item.id, Number(e.target.value));
                    }}
                    className="shadow-sm rounded-lg bg-white text-black justify-center text-center"
                    style={{
                      width: `${String(item.quantity).length + 2 || 1}ch`,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                  >
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
          </li>
        ))}
      </div>

      <div id="go-to-menu-group" className="">
        <div className="h-px bg-gray-300"></div>
        <div className="flex justify-center mt-5">
          <Link
            href="/"
            className=" text-blue-500 text-lg font-medium hover:bg-gray-300 active:bg-gray-300 rounded-lg py-2 px-4"
          >
            메뉴 더 추가 +
          </Link>
        </div>
      </div>

      <div
        id="order-button-group"
        className="font-medium text-lg fixed bottom-0 left-0 right-0 px-4 pb-4"
      >
        <button className="flex justify-center items-center mx-auto w-full bg-blue-500 rounded-xl text-white px-4 py-2 hover:bg-blue-600 active:hover:bg-blue-600">
          <span className="mr-2 font-semibold text-sm bg-white text-blue-500 px-2 py-0.5 rounded-lg">
            {cartItems.length}
          </span>
          <span>{totalPrice.toLocaleString()}</span>원 주문하기
        </button>
      </div>
    </div>
  );
}
