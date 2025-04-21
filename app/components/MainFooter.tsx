"use client";

import { useCartStore } from "../store/store";
import FooterInfo from "./FooterInfo";

export default function MainFooter() {
  const { cartItems } = useCartStore();
  return (
    <footer
      className={`bg-tossgray-400 p-6 text-13 ${
        cartItems.length > 0 ? "pb-32" : ""
      }`}
    >
      <div className="flex flex-col gap-3">
        <span className="text-tossgray-700 font-semibold">가게정보·원산지</span>
        <FooterInfo label="상호명">토스 카페</FooterInfo>
        <FooterInfo label="가게주소">
          서울특별시 강남구 테헤란로 131 (역삼동) 17층
        </FooterInfo>
        <FooterInfo label="원산지">
          가라아게-닭고기(국내산), 돈코츠라멘-돼지고기(국내산), 소고기(미국산),
          김치(국내산)
        </FooterInfo>
      </div>
    </footer>
  );
}
