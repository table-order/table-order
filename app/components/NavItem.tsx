"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useHash } from "../hooks/useHash";
import { useInView } from "react-intersection-observer";

type NavItemProps = {
  label: string;
  href: string;
};

export default function NavItem({ label, href }: NavItemProps) {
  const hash = useHash(); // 현재 해시 값 가져오기
  const [isActive, setIsActive] = useState(false);
  const sectionId = href.substring(1);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px -100% 0px", // 섹션의 상단이 최상단에 닿는지 감지
  });

  useEffect(() => {
    setIsActive(decodeURIComponent(hash) === decodeURIComponent(href));
  }, [hash, href]);

  useEffect(() => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      ref(sectionElement); // ref를 섹션 요소에 연결
    }
  }, [sectionId, ref]);

  useEffect(() => {
    console.log(`inView: ${inView}`);
    if (inView) {
      setIsActive(true); // 섹션의 상단이 최상단에 닿아 있으면 isActive를 true로 설정
    } else {
      setIsActive(false); // 섹션의 상단이 최상단에서 벗어나면 isActive를 false로 설정
    }
  }, [inView]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <div
        className={`flex-shrink-0 py-2 mr-6 font-semibold text-gray-700 
       ${isActive ? "border-b-2 border-gray-700" : ""}`}
      >
        {label}
      </div>
    </Link>
  );
}
