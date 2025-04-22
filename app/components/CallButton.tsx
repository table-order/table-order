"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useToastStore } from "../store/toastStore";

const callOptions = ["물", "냅킨", "직원부르기"];

export default function CallButton() {
  const [modalStatus, setModalStatus] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const addToast = useToastStore((state) => state.addToast);

  const onHandleModalStatus = () => {
    if (modalStatus) {
      setIsClosing(true);
      setTimeout(() => {
        setModalStatus(false);
        setIsClosing(false);
      }, 200);
    } else {
      setModalStatus(true);
    }
  };

  const handleCloseButton = () => {
    setModalStatus(false);
    setSelectedOptions([]);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions(
      (prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option) // 이미 선택된 옵션은 제거
          : [...prev, option] // 선택되지 않은 옵션은 추가
    );
  };

  const handleCallButtonClick = () => {
    setModalStatus(false);
    setSelectedOptions([]);
    // 호출하기 로직 추가 (API 호출)
    addToast("호출했어요", "success");
  };

  useEffect(() => {
    if (modalStatus || isClosing) {
      // 현재 스크롤 위치를 고정
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    }

    // 모달이 닫힐 때 body 스크롤 복원
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [modalStatus, isClosing]);

  return (
    <div>
      <button
        className="flex items-start justify-start gap-1 ml-auto text-17 text-tossgray-700 font-semibold p-1"
        onClick={onHandleModalStatus}
      >
        <Image
          src="https://static.toss.im/2d-emojis/svg/u1F6CE.svg"
          alt="직원호출"
          width={24}
          height={24}
        />
        <span>직원호출</span>
      </button>
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
                <h2 className="text-xl text-tossgray-900 font-bold mb-8">
                  무엇을 도와드릴까요?
                </h2>
                <div className="flex gap-2 animate-fade-up">
                  {callOptions.map((option, index) => (
                    <div
                      key={option}
                      className="w-full flex justify-center items-center"
                    >
                      <input
                        id={option}
                        name="options[]"
                        key={index}
                        type="checkbox"
                        value={option}
                        className="peer hidden"
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleOptionChange(option)}
                      />
                      <label
                        key={option}
                        htmlFor={option}
                        className="select-none text-15 w-full text-center cursor-pointer rounded-lg bg-tossgray-400
py-7 px-4 font-medium text-tossgray-700 transition-colors duration-100  peer-checked:bg-tossgray-700  peer-checked:text-white "
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex mt-12 gap-2 text-17 font-semibold">
                  <button
                    onClick={handleCloseButton}
                    className="bg-tossgray-400 w-full rounded-2xl"
                  >
                    닫기
                  </button>
                  <button
                    onClick={handleCallButtonClick}
                    disabled={selectedOptions.length === 0}
                    className="bg-tossblue-500 w-full p-4 rounded-2xl text-white disabled:opacity-25"
                  >
                    호출하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
