"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FixedBottomCTA from "./FixedBottomCTA";
import { useToastStore } from "../store/toastStore";
import { createClient } from "@/utils/supabase/client";
import { getLocalStorage } from "@/utils/storage";

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

const SHAKE_DELAY = 400;
const SHAKE_INTERVAL = 100;
const SHAKE_DURATION_DECREMENT = 0.01;
const MIN_SHAKE_DURATION = 0.05;
const MAX_SHAKE_DURATION = 0.4;

export default function MenuDetailContent({ menu }: MenuDetailContentProps) {
  const [amount, setAmount] = useState(1);
  const discountedPrice = null;
  // const { addToCart } = useCartStore();
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const menuPrice = `${(amount * menu.price).toLocaleString()}`;
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [borderRadius, setBorderRadius] = useState("12px");
  const [scale, setScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState("bg-tossgray-400");
  const [plusbgColor, setPlusbgColor] = useState("bg-tossgray-400");
  const [minusbgColor, setMinusbgColor] = useState("bg-tossgray-400");
  const [amountColor, setAmountColor] = useState("text-gray-800");
  const [amountPlusScale, setAmountPlusScale] = useState(1);
  const [amountMinusScale, setAmountMinusScale] = useState(1);
  const [plusSvgColor, setPlusSvgColor] = useState("stroke-gray-500");
  const [minusSvgColor, setMinusSvgColor] = useState("stroke-gray-500");
  const [isHoldingRight, setIsHoldingRight] = useState(false);
  const [isHoldingLeft, setIsHoldingLeft] = useState(false);
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const shakeDelayTimeout = useRef<NodeJS.Timeout | null>(null);
  const shakeSpeedInterval = useRef<NodeJS.Timeout | null>(null);

  const shakingDivRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // const { cartItems, updateQuantity } = useCartStore();

  const handleAddToCart = async (
    itemId: number,
    name: string,
    price: number
  ) => {
    const userId = getLocalStorage("userId");
    // 1. Cart 테이블이 비어있는지 확인
    const { data: cartItems, error: fetchCartError } = await supabase
      .from("Cart")
      .select("*");

    if (fetchCartError) {
      console.error("Error fetching cart items:", fetchCartError);
      return;
    }

    if (cartItems.length === 0) {
      // 2. Cart 테이블이 비어있으면 INSERT
      try {
        const { error: insertError } = await supabase.from("Cart").insert({
          name: name,
          price: price,
          quantity: amount,
          itemId: itemId,
          userId: userId,
        });

        if (insertError) {
          console.error("Error inserting cart item:", insertError);
          return;
        }
      } catch (error) {
        console.error("Error inserting cart item:", error);
        return;
      }
    } else {
      // 3. Cart 테이블이 비어있지 않으면 기존 항목 조회
      const { data: existingItem, error: fetchItemError } = await supabase
        .from("Cart")
        .select("*")
        .eq("itemId", itemId)
        .eq("userId", userId)
        .maybeSingle();

      if (fetchItemError && fetchItemError.code !== "PGRST116") {
        // PGRST116은 "No rows found" 오류 코드입니다.
        console.error("Error fetching cart item:", fetchItemError);
        return;
      }

      if (existingItem) {
        // 4. 기존 항목이 있으면 UPDATE
        try {
          const { error: updateError } = await supabase
            .from("Cart")
            .update({ quantity: existingItem.quantity + amount })
            .eq("itemId", itemId)
            .eq("userId", userId);

          if (updateError) {
            console.error("Error updating cart item:", updateError);
            return;
          }

          addToast("ch: 메뉴를 추가했어요");
        } catch (error) {
          console.error("Error updating cart item:", error);
          return;
        }
      } else {
        // 5. 기존 항목이 없으면 INSERT
        try {
          const { error: insertError } = await supabase.from("Cart").insert({
            itemId: itemId,
            name: name,
            price: price,
            quantity: amount,
            userId: userId,
          });

          if (insertError) {
            console.error("Error inserting cart item:", insertError);
            return;
          }
        } catch (error) {
          console.error("Error inserting cart item:", error);
          return;
        }
      }
    }

    // 6. Zustand 스토어 업데이트
    // const existingCartItem = cartItems.find((item) => item.id === itemId);
    // if (existingCartItem) {
    //   updateQuantity(itemId, existingCartItem.quantity + amount);
    // } else {
    //   addToCart({ id: itemId, name, price, quantity: amount });
    // }

    // 7. 성공 메시지 및 페이지 이동
    //addToast("장바구니에 추가했어요", "success");
    router.push("/");
  };
  // const handleAddToCart = async () => {
  //   addToCart({
  //     id: menu.id,
  //     name: menu.name,
  //     price: menu.price,
  //     quantity: amount,
  //   });
  //   const { error } = await supabase.from("Cart").insert({
  //     name: menu.name,
  //     price: menu.price,
  //     quantity: amount,
  //     itemId: menu.id,
  //     // userId: userId, // 현재 사용자 ID
  //   });

  //   if (error) {
  //     console.error("Error adding to cart:", error);
  //     addToast("장바구니 추가 실패", "error"); // 토스트 메시지
  //     return; // 에러 처리
  //   }
  //   router.push("/");
  //   addToast("장바구니에 메뉴를 추가했어요", "success");
  // };

  const startShaking = (speed: string) => {
    if (shakingDivRef.current) {
      shakingDivRef.current.style.animation = `slowVibrate ${speed} ease-in-out infinite`;
      setIsShaking(true);
    }
  };

  const stopShaking = () => {
    if (shakingDivRef.current) {
      shakingDivRef.current.style.animation = "";
      setIsShaking(false);
    }
    if (shakeSpeedInterval.current) {
      clearInterval(shakeSpeedInterval.current);
      shakeSpeedInterval.current = null;
    }
    if (shakeDelayTimeout.current) {
      clearTimeout(shakeDelayTimeout.current);
      shakeDelayTimeout.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setBorderRadius("45px");
    setScale(0.95);
    setBackgroundColor("bg-tossgray-200");
    stopShaking();
  };

  const startShakingAnimation = () => {
    let animDuration = MAX_SHAKE_DURATION;
    shakeSpeedInterval.current = setInterval(() => {
      animDuration -= SHAKE_DURATION_DECREMENT;
      if (animDuration <= MIN_SHAKE_DURATION) {
        animDuration = MIN_SHAKE_DURATION;
        if (shakeDelayTimeout.current) {
          clearTimeout(shakeDelayTimeout.current);
          shakeDelayTimeout.current = null;
        }
      }
      startShaking(`${animDuration}s`);
    }, SHAKE_INTERVAL);
    shakeDelayTimeout.current = null; // setTimeout 콜백이 실행되었으므로 null로 설정
  };

  const handleLeftSlideForShake = () => {
    if (
      amount <= 1 &&
      !shakeDelayTimeout.current &&
      !shakeSpeedInterval.current
    ) {
      shakeDelayTimeout.current = setTimeout(
        startShakingAnimation,
        SHAKE_DELAY
      );
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const deltaX = e.touches[0].clientX - startX;
      const maxTranslateX = 43;
      const clampedDeltaX = Math.min(
        Math.max(deltaX, -maxTranslateX),
        maxTranslateX
      );
      setTranslateX(clampedDeltaX);

      const isLeftSlideSufficient = clampedDeltaX <= -maxTranslateX;
      const isRightSlideSufficient = clampedDeltaX >= maxTranslateX;

      if (isRightSlideSufficient) {
        setIsHoldingRight(true);
        setIsHoldingLeft(false);
        stopShaking();
      } else if (isLeftSlideSufficient) {
        setIsHoldingLeft(true);
        setIsHoldingRight(false);
        handleLeftSlideForShake();
      } else {
        setIsHoldingRight(false);
        setIsHoldingLeft(false);
        stopShaking();
      }

      setBorderRadius("45px");
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaX = translateX;
    if (deltaX > 10) {
      setAmount((prev) => prev + 1);
    } else if (deltaX < -10) {
      setAmount((prev) => (prev > 1 ? prev - 1 : prev));
    }
    setTranslateX(0);
    setBorderRadius("12px");
    setScale(1);
    setBackgroundColor("bg-tossgray-400");
    setIsHoldingRight(false);
    setIsHoldingLeft(false);
    stopShaking();

    setTimeout(() => {
      setAmountColor("text-tossblue-500");
    }, 100);
    setTimeout(() => {
      setAmountColor("text-tossgray-800");
    }, 500);
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      clearInterval(holdTimeout as unknown as NodeJS.Timeout);
    }
  };

  useEffect(() => {
    if (isHoldingRight) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setAmount((prev) => prev + 1);
        }, 100);
        setHoldTimeout(interval as unknown as NodeJS.Timeout);
      }, 500);
      setHoldTimeout(timeout);
    } else if (isHoldingLeft) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setAmount((prev) => (prev > 1 ? prev - 1 : prev));
        }, 100);
        setHoldTimeout(interval as unknown as NodeJS.Timeout);
      }, 500);
      setHoldTimeout(timeout);
    } else if (holdTimeout) {
      clearTimeout(holdTimeout);
      clearInterval(holdTimeout as unknown as NodeJS.Timeout);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, [isHoldingRight, isHoldingLeft]);

  useEffect(() => {
    return () => {
      if (holdTimeout) {
        clearTimeout(holdTimeout);
        clearInterval(holdTimeout as unknown as NodeJS.Timeout);
      }
      stopShaking();
    };
  }, [holdTimeout]);

  const handlePlusTouchStart = () => {
    setAmountPlusScale(0.9);
    setScale(0.9);
    setPlusbgColor("bg-tossgray-500");
    setPlusSvgColor("stroke-gray-700");
    setAmount((prev) => prev + 1);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setAmount((prev) => prev + 1);
      }, 100);
      setHoldTimeout(interval as unknown as NodeJS.Timeout);
    }, 500);
    setHoldTimeout(timeout);
  };

  const handlePlusTouchEnd = () => {
    setPlusbgColor("stroke-gray-500");
    setPlusSvgColor("stroke-gray-500");
    setAmountPlusScale(1);
    setScale(1);
    setTimeout(() => {
      setAmountColor("text-tossblue-500");
    }, 100);
    setTimeout(() => {
      setAmountColor("text-tossgray-800");
    }, 500);
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      clearInterval(holdTimeout as unknown as NodeJS.Timeout);
    }
  };
  const handleMinusTouchStart = () => {
    if (amount === 1) {
      startShaking(`${1}`);
      setTimeout(stopShaking, 200);
    } else if (amount > 1) {
      setAmountMinusScale(0.9);
      setScale(0.9);
      setMinusbgColor("bg-tossgray-500");
      setMinusSvgColor("stroke-gray-700");
      setTimeout(() => {
        setAmountColor("text-tossblue-500");
      }, 100);
      setTimeout(() => {
        setAmountColor("text-tossgray-800");
      }, 500);
      setAmount((prev) => (prev > 1 ? prev - 1 : prev));
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setAmount((prev) => (prev > 1 ? prev - 1 : prev));
        }, 100);
        setHoldTimeout(interval as unknown as NodeJS.Timeout);
      }, 500);
      setHoldTimeout(timeout);
    }
  };

  const handleMinusTouchEnd = () => {
    setAmountMinusScale(1);
    setScale(1);
    setMinusbgColor("bg-tossgray-400");
    setMinusSvgColor("stroke-gray-500");

    if (holdTimeout) {
      clearTimeout(holdTimeout);
      clearInterval(holdTimeout as unknown as NodeJS.Timeout);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-8 p-6 pb-32">
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
          <div
            ref={shakingDivRef}
            className={`relative flex rounded-xl transition-all duration-100 ease-in-out ${backgroundColor} ${
              isShaking ? "animate-shake" : ""
            }`}
            style={{
              borderRadius: borderRadius,
            }}
          >
            <div className="flex items-center p-3 rounded-xl">
              <button
                onTouchStart={handleMinusTouchStart}
                onTouchEnd={handleMinusTouchEnd}
                // onClick={handleMinusClick}
                style={{
                  transition: "all 0.2s ease",
                  transform: `scale(${amountMinusScale})`,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  className={`size-5 ${
                    amount <= 1 ? "stroke-gray-300" : `${minusSvgColor}`
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
            <div
              className={`flex justify-center bg-white font-semibold ${amountColor} text-lg px-6 py-2 my-1 rounded-xl shadow w-12`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: `translateX(${translateX}px)`,
                transition: "all 0.1s ease",
                borderRadius: borderRadius,
                scale: scale,
                zIndex: 2,
              }}
            >
              {amount}
            </div>
            <div
              className={`absolute left-10 opacity-10 w-[70%] inset-0 rounded-xl ${plusbgColor}`}
              style={{
                transform: `scale(${amountPlusScale})`,
                transition: "all 0.2s ease",
                pointerEvents: "none",
              }}
            ></div>
            <div
              className={`absolute right-10 opacity-10 w-[70%] inset-0 rounded-xl ${minusbgColor}`}
              style={{
                transform: `scale(${amountMinusScale})`,
                transition: "all 0.2s ease",
                pointerEvents: "none",
              }}
            ></div>
            <div
              className="flex items-center p-3 rounded-xl"
              style={{
                transition: "all 0.2s ease",
              }}
            >
              <button
                onTouchStart={handlePlusTouchStart}
                onTouchEnd={handlePlusTouchEnd}
                style={{
                  transition: "all 0.2s ease",
                  transform: `scale(${amountPlusScale})`,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  className={`size-5 ${plusSvgColor}`}
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
          onClick={() => handleAddToCart(menu.id, menu.name, menu.price)}
          amount={amount}
          menuPrice={menu.price * amount}
          menuId={menu.id}
        />
      </div>
    </div>
  );
}
