"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function FailPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <div className="wrapper w-full">
      <div className="flex flex-col items-center w-full max-w-[540px]">
        <img
          src="https://static.toss.im/lotties/error-spot-apng.png"
          width="120"
          height="120"
        />
        <h2 className="title">결제를 실패했어요</h2>
        <div className="response-section w-full">
          <div className="flex justify-between">
            <span className="response-label">code</span>
            <span id="error-code" className="response-text">
              {errorCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="response-label">message</span>
            <span id="error-message" className="response-text">
              {errorMessage}
            </span>
          </div>
        </div>

        <div className="w-full text-center button-group">
          <Link className="btn" href="/" rel="noreferrer noopener">
            주문홈으로 돌아가기
          </Link>
          <div className="flex" style={{ gap: "16px" }}>
            <a
              className="btn w-full"
              href="https://docs.tosspayments.com/reference/error-codes"
              target="_blank"
              rel="noreferrer noopener"
            >
              에러코드 문서보기
            </a>
            <a
              className="btn w-full"
              href="https://techchat.tosspayments.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              실시간 문의하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
