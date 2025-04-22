"use client";

import { useEffect, useState, useRef } from "react";
import { useCartStore } from "../store/store";
import { useRouter } from "next/navigation";
import FixedBottomCTA from "./FixedBottomCTA";
import { useToastStore } from "../store/toastStore";

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
  const { addToCart } = useCartStore();
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

  const handleAddToCart = () => {
    addToCart({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: amount,
    });
    router.push("/");
    addToast("장바구니에 메뉴를 추가했어요", "success");
  };

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
          onClick={handleAddToCart}
          amount={amount}
          menuPrice={menuPrice}
        />
      </div>
    </div>
  );
}
