"use client";

import { useEffect, useState } from "react";

export const useHash = () => {
  const [hash, setHash] = useState("");

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      setHash(window.location.hash); // 초기 해시 값 설정

      const onHashChanged = () => setHash(window.location.hash);
      const { pushState, replaceState } = window.history;
      window.history.pushState = function (...args) {
        pushState.apply(window.history, args);
        setTimeout(() => setHash(window.location.hash));
      };
      window.history.replaceState = function (...args) {
        replaceState.apply(window.history, args);
        setTimeout(() => setHash(window.location.hash));
      };
      window.addEventListener("hashchange", onHashChanged);

      return () => {
        window.removeEventListener("hashchange", onHashChanged);
      };
    }
  }, []);

  return hash;
};
