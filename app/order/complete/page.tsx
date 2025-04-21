"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Progress from "./progress";

export default function CompletePage() {
  const [isLoading, setLoading] = useState(true);

  //주문중...먼저 3초간 로딩 후, 주문완료 페이지 렌더링

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading((pre) => !pre);
    }, 3000);
    return () => clearTimeout(timer);
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
        {/* TODO: 주문 내역 추가예정 */}
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
