"use client";

import NavItem from "./NavItem";
import { useEffect, useState } from "react";

const navItems = [
  { label: "단품", href: "단품" },
  { label: "세트", href: "세트" },
  { label: "사이드", href: "사이드" },
  { label: "음료", href: "음료" },
];

export default function NavBar() {
  const [isFixed, setIsFixed] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (modalStatus || isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalStatus, isClosing]);

  const onHandleModalStatus = () => {
    if (modalStatus) {
      setIsClosing(true);
      setTimeout(() => {
        setModalStatus(false); // 애니메이션 완료 후 모달창 상태 업데이트
        setIsClosing(false);
      }, 200);
    } else {
      setModalStatus(true);
    }
  };

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
      className={`${isFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"}`}
    >
      <div className="bg-white">
        <div className="flex mb-4 pt-2 pl-6 border-b-[0.5px] border-b-tossgray-400 whitespace-nowrap overflow-hidden text-ellipsis">
          {navItems.map((item) => (
            <NavItem key={item.label} label={item.label} href={item.href} />
          ))}
          <button
            onClick={onHandleModalStatus}
            className={`absolute ${
              isFixed ? "right-6" : "right-6"
            } top-7 transform -translate-y-1/2 w-8 h-8 rounded-full text-sm font-semibold text-tossgray-600 opacity-75 bg-tossgray-400 flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4.5"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {(modalStatus || isClosing) && (
        <div className="fixed inset-0 z-50" onClick={onHandleModalStatus}>
          {/* 배경 */}
          <div className="fixed inset-0 bg-black opacity-20"></div>
          {/* 모달창 내용 */}
          <div className="fixed inset-0 flex items-end justify-center">
            <div
              className={`bg-white p-6 m-2 w-full rounded-3xl shadow-lg flex flex-col items-start ${
                isClosing ? "animate-slide-down" : "animate-slide-up"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="animate-fade-up w-full">
                <h2 className="text-xl font-bold mb-8">
                  카테고리를 선택해주세요
                </h2>
                <div className="text-17 w-full grid grid-cols-2 gap-4 animate-fade-up">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.label}
                      label={item.label}
                      href={item.href}
                      onClick={onHandleModalStatus}
                      isModal={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
