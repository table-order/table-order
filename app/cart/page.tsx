"use client";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  //TODO: 임시데이터 cartItem=장바구니, 전역상태 필요
  const [cartItem, setCartItem] = useState([
    {
      id: 1,
      name: "POST PREMIUM 오리지날 치즈 버거",
      price: 9500,
      quantity: 1,
    },
    {
      id: 2,
      name: "POST PREMIUM 베이컨 치즈버거",
      price: 10500,
      quantity: 1,
    },
  ]);
  const [totalPrice, setTotalPrice] = useState(22500); //TODO: 가격계산

  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    setCartItem((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const deleteItem = (itemId: number) => {
    setCartItem((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <div id="container" className="px-6 pt-6 pb-4">
      <h1 className="font-bold text-2xl my-8">장바구니</h1>
      <div id="myMenu">
        <p className="font-bold mb-5 text-xl">내 메뉴</p>
        {cartItem.map((item) => (
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
                      deleteItem(item.id);
                    }}
                    className="size-10 fill-gray-400 hover:fill-gray-500"
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
                  className="hover:bg-gray-300 transition font-semibold rounded-lg bg-gray-100 text-gray-500 px-4 py-2"
                >
                  옵션 변경
                </button>
                <div
                  id="count-button-group"
                  className="flex items-center px-3 rounded-lg gap-1 bg-gray-100 text-gray-500"
                >
                  <button type="button">-</button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      updateItemQuantity(item.id, Number(e.target.value));
                    }}
                    className="shadow-sm rounded-lg bg-white text-black justify-center text-center"
                    style={{
                      width: `${String(item.quantity).length + 2 || 1}ch`,
                    }}
                  />
                  <button type="button">+</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </div>

      <div id="go-to-menu-group" className="fixed bottom-48 left-0 right-0 ">
        <div className="h-px bg-gray-300"></div>
        <div className="flex justify-center mt-5">
          <Link href="/" className=" text-blue-500 text-lg font-medium">
            메뉴 더 추가 +
          </Link>
        </div>
      </div>

      <div
        id="order-button-group"
        className="font-medium text-lg fixed bottom-0 left-0 right-0 px-4 pb-4"
      >
        <button className="flex justify-center items-center mx-auto w-full bg-blue-500 rounded-xl text-white px-4 py-2">
          <span className="mr-2 font-semibold text-sm bg-white text-blue-500 px-2 py-0.5 rounded-lg">
            {cartItem.length}
          </span>
          <span>{totalPrice.toLocaleString()}</span>원 주문하기
        </button>
      </div>
    </div>
  );
}
