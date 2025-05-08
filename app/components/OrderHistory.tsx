"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  orderId: string;
};

type Order = {
  id: string;
  created_at: string;
  totalPrice: number;
  totalQuantity: number;
  orderItems: OrderItem[];
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: orders } = await supabase
        .from("Order")
        .select(
          `
          *,
          orderItems:OrderItem(*)
        `
        )
        .order("created_at", { ascending: false });

      setOrders(orders || []);
    };

    fetchOrders();
  }, []);

  if (!orders || orders.length === 0) {
    return (
      <div className="pt-6">
        <span className="font-medium text-17 text-tossgray-500">
          아직 주문 내역이 없어요
        </span>
      </div>
    );
  }

  const totalItems = orders.reduce(
    (total, order) => total + order.totalQuantity,
    0
  );
  const totalPrice = orders
    .reduce((total, order) => total + order.totalPrice, 0)
    .toLocaleString();

  return (
    <>
      <div className="pt-6">
        <span className="text-22 font-bold text-tossgray-900">
          총 {totalItems}개 | {totalPrice}원
        </span>
      </div>
      {orders.map((order, index) => (
        <div key={order.id}>
          <div className="flex justify-between mt-6 mb-5">
            <span className="text-tossgray-800 text-17 font-bold">
              {index === 0 ? "최근" : "이전"} 주문 내역 ({order.totalQuantity}
              개)
            </span>
            <span className="text-tossgray-700 text-15">
              {new Date(order.created_at).toLocaleString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {order.orderItems.map((item) => (
              <div className="flex flex-col" key={item.id}>
                <span className="text-tossgray-800 font-bold text-17">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-15 text-tossgray-700">
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
          {index !== orders.length - 1 ? (
            <hr className="my-6 text-tossgray-400" />
          ) : null}
        </div>
      ))}
    </>
  );
}
