"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToastStore } from "../store/toastStore";

type CartItem = {
  quantity: number;
  MenuItem: { price: number } | null;
};

type FixedBottomCTAProps = {
  menuId?: number;
  onClick?: () => void;
  amount?: number;
  defaultRoute?: string;
  buttonText?: string;
  menuPrice?: number;
};

export default function FixedBottomCTA({
  menuId,
  onClick,
  amount,
  defaultRoute = "/cart",
  buttonText = "담기",
  menuPrice,
}: FixedBottomCTAProps) {
  const router = useRouter();
  const [displayAmount, setDisplayAmount] = useState<number | undefined>(0);
  const [displayPrice, setDisplayPrice] = useState<string | undefined>("0");
  const [shouldRender, setShouldRender] = useState(false);
  const supabase = createClient();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (amount !== undefined || menuPrice !== undefined) {
      setDisplayAmount(amount || 0);
      setDisplayPrice(menuPrice?.toLocaleString());
      setShouldRender((amount || 0) > 0);
      return;
    }
    const fetchData = async () => {
      if (menuId) {
        try {
          const { data, error } = await supabase
            .from("MenuItem")
            .select("price")
            .eq("id", menuId)
            .single();

          if (error) {
            console.error("Error fetching menu price:", error);
            setDisplayPrice("0");
          } else {
            setDisplayPrice(data.price.toLocaleString());
          }

          const { data: cartData, error: cartError } = await supabase
            .from("Cart")
            .select("quantity")
            .eq("itemId", menuId); // Cart 테이블의 itemId 컬럼 사용

          if (cartError) {
            console.error("Error fetching cart quantity:", cartError);
            setDisplayAmount(0);
          } else {
            const totalQuantity = cartData.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            setDisplayAmount(totalQuantity);
            setShouldRender(totalQuantity > 0);
          }
        } catch (error) {
          console.error("An error occurred:", error);
          setDisplayPrice("0");
          setDisplayAmount(0);
          setShouldRender(false);
        }
      } else {
        // menuId가 없는 경우 장바구니 합계 사용 (기존 로직)
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select<"quantity, MenuItem(price)", CartItem>(
            "quantity, MenuItem(price)"
          ); // Cart와 MenuItem 조인

        if (cartError) {
          console.error("Error fetching cart data:", cartError);
          setShouldRender(false);
        } else {
          let totalPrice = 0;
          let totalQuantity = 0;
          cartData.forEach((item) => {
            if (item.MenuItem?.price) {
              // price가 있는지 확인
              totalPrice += item.MenuItem.price * item.quantity;
            }
            totalQuantity += item.quantity;
          });
          setDisplayPrice(totalPrice.toLocaleString());
          setDisplayAmount(totalQuantity);
          setShouldRender(totalQuantity > 0);
        }
      }
    };

    fetchData();

    // const cartChanges = supabase
    //   .channel("cart_changes")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "*",
    //       schema: "public",
    //       table: "Cart",
    //     },
    //     (payload) => {
    //       fetchData();
    //       switch (payload.eventType) {
    //         case "INSERT":
    //           console.log("추가된 장바구니 아이템:", payload.new);
    //           addToast(
    //             `멤버가 ${payload.new.name}메뉴를 추가했어요.`,
    //             "success"
    //           );
    //           break;

    //         case "DELETE":
    //           console.log("삭제된 장바구니 아이템 전체 정보:", payload.old);
    //           addToast(
    //             `멤버가 ${payload.old.name}메뉴를 삭제했어요.`,
    //             "success"
    //           );
    //           break;
    //       }
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   cartChanges.unsubscribe();
    // };
  }, [menuId, router, supabase, amount, addToast, menuPrice]);

  // onClick이 제공되지 않으면 기본 동작
  const handleClick = onClick || (() => router.push(defaultRoute));

  // shouldRender가 false이면 버튼을 완전히 숨김
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 bottom-0 p-6 h-[112px] flex justify-center items-center bg-linear-to-t from-white from-75% to-transparent z-49">
      <button
        onClick={handleClick}
        className="py-3 w-full font-semibold text-xl text-white text-center rounded-2xl bg-tossblue-500 max-w-md animate-custom animate-duration-[1s] animate-ease-[cubic-bezier(0.25,0.1,0.25,1))"
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
