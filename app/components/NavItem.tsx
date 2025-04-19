"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type NavItemProps = {
  label: string;
  href: string;
  onClick?: () => void;
  isModal?: boolean;
};

export default function NavItem({
  label,
  href,
  onClick,
  isModal,
}: NavItemProps) {
  const [isActive, setIsActive] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px -100% 0px", // 섹션의 상단이 최상단에 닿는지 감지
  });

  useEffect(() => {
    const sectionElement = document.getElementById(href);
    if (sectionElement) {
      ref(sectionElement); // ref를 섹션 요소에 연결
    }
  }, [href, ref]);

  useEffect(() => {
    if (inView) {
      setIsActive(true); // 섹션의 상단이 최상단에 닿아 있으면 isActive를 true로 설정
    } else {
      setIsActive(false); // 섹션의 상단이 최상단에서 벗어나면 isActive를 false로 설정
    }
  }, [inView]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const sectionElement = document.getElementById(href);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <div
        className={`flex-shrink-0 text-17 py-2 mr-6 font-semibold
           ${
             isActive
               ? isModal
                 ? "text-tossblue-500"
                 : "border-b-2 border-b-tossgray-800 text-tossgray-800"
               : "text-tossgray-800"
           }`}
      >
        {label}
      </div>
    </Link>
  );
}
