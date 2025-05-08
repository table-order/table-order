"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Progress from "./progress";
// import { useCartStore } from "@/app/store/store";
import OrderHistory from "@/app/components/OrderHistory";
import { getLocalStorage } from "@/utils/storage";
import { createClient } from "@/utils/supabase/client";

export default function CompletePage() {
  const [isLoading, setLoading] = useState(true);
  // const { completeOrder } = useCartStore();

  const supabase = createClient();
  //주문중...먼저 3초간 로딩 후, 주문완료 페이지 렌더링

  const moveCartToOrder = async () => {
    const userId = getLocalStorage("userId");

    const { error: updateError } = await supabase
      .from("Cart")
      .update({ isOrderComplete: true })
      .gt("id", -1);

    if (updateError) {
      console.error("Error updating cart status:", updateError);
      return;
    }

    const { data: cartItems, error: cartError } = await supabase
      .from("Cart")
      .select("*");

    if (cartError) {
      console.error("Error fetching cart items:", cartError);
      return;
    }
    if (!cartItems || cartItems.length === 0) return;

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const { data: orderData, error: orderError } = await supabase
      .from("Order")
      .insert({
        userId: userId,
        totalPrice: totalPrice,
        totalQuantity: totalQuantity,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("Error creating order:", orderError);
      return;
    }

    const { error: orderItemsError } = await supabase.from("OrderItem").insert(
      cartItems.map((item) => ({
        orderId: orderData.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        menuId: item.itemId,
        userId: item.userId,
      }))
    );

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("Cart")
      .delete()
      .neq("id", 0);

    if (deleteError) {
      console.error("Error clearing cart:", deleteError);
    }
  };

  useEffect(() => {
    const completeOrderProcess = async () => {
      await moveCartToOrder(); // 카트 내용을 주문으로 이동
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    };

    completeOrderProcess();
  }, []);

  if (isLoading) {
    return (
      <>
        <Progress />
      </>
    );
  }

  return (
    <>
      <article className="p-6 mb-[112px]">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold text-tossgray-900">
              주문을 완료했어요
            </span>
            <span className="text-15 font-normal text-[#f04452]">
              나갈 때 직접 결제, 잊지 마세요.
            </span>
          </div>
          <Image
            alt="clap"
            width={60}
            height={60}
            src="https://static.toss.im/3d-emojis/u1F44F-apng.png"
            aria-hidden="true"
          />
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
