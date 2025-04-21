"use client";

import { useEffect, useState } from "react";

export default function Progress() {
  const [showMessage, setMessage] = useState("first");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(() => "second");
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex p-6 h-screen justify-center">
      <div className="flex flex-col items-center  text-center font-bold text-[30px] justify-center">
        <p className="animate-fade-up" key={showMessage}>
          {showMessage === "first" ? (
            "주문 넣는 중..."
          ) : (
            <>
              결제는 나갈 때, <br />
              잊지마세요!
            </>
          )}
        </p>
      </div>
    </div>
  );
}
