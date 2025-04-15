"use client";

import NavItem from "./NavItem";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const navItems = [
  { label: "단품", href: "#단품" },
  { label: "세트", href: "#세트" },
  { label: "사이드", href: "#사이드" },
  { label: "음료", href: "#음료" },
  { label: "직원호출", href: "#직원호출" },
];

export default function NavBar() {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // 스크롤 위치가 100px을 넘으면 고정
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${
        isFixed ? "fixed top-0 left-0 right-0 z-50 px-6" : "relative"
      }`}
    >
      <div className="bg-white">
        <div className="flex mb-2 pt-2 justify-around border-b-1 border-b-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
          {navItems.map((item) => (
            <NavItem key={item.label} label={item.label} href={item.href} />
          ))}
          <button
            className={`absolute ${
              isFixed ? "right-6" : "right-0"
            } top-7 transform -translate-y-1/2 w-6 h-6 rounded-full text-sm font-semibold text-gray-700 opacity-75 bg-gray-200 flex items-center justify-center`}
          >
            <ChevronDownIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
