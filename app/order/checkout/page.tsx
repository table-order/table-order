"use client";

import {
  loadTossPayments,
  TossPaymentsWidgets,
  ANONYMOUS,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useCartStore } from "@/app/store/store";
import { createClient } from "@/utils/supabase/client";

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
// const customerKey = generateRandomString();

export default function WidgetCheckoutPage() {
  const { getTotalPrice, cartItems } = useCartStore();
  const totalPrice = getTotalPrice();

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
        // const widgets = tossPayments.widgets({
        //   customerKey,
        // });
        // 비회원 결제
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      const supabase = createClient();
      const { data: cartItems, error } = await supabase
        .from("Cart") // 'cart' 테이블에서 데이터 조회
        .select("*"); // 모든 컬럼 선택

      if (error) {
        console.error("Error fetching cart items:", error);
        return;
      }

      // 총 금액 계산
      const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // ------  주문서의 결제 금액 설정 ------
      // TODO: 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
      // TODO: renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
      // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
      await widgets.setAmount({
        currency: "KRW",
        value: totalPrice,
      });

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          // 렌더링하고 싶은 결제 UI의 variantKey
          // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
          // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderagreement
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, totalPrice]);

  return (
    <div className="wrapper">
      <div className="max-w-[540px] w-full">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />

        {/* 결제하기 버튼 */}
        <button
          className="btn primary w-full mt-[30px]"
          // style={{ marginTop: "30px" }}
          disabled={!ready}
          // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
          onClick={async () => {
            try {
              const supabase = createClient();
              const { data: cartItems, error } = await supabase
                .from("Cart")
                .select("*");

              if (error) {
                console.error("Error fetching cart items:", error);
                return;
              }

              // orderName 생성
              const orderName =
                cartItems.length > 1
                  ? `${cartItems[0].name} 외 ${cartItems.length - 1}건`
                  : cartItems[0].name;
              // const orderName =
              //   cartItems.length > 1
              //     ? `${cartItems[0].name} 외 ${cartItems.length - 1}건`
              //     : cartItems[0].name;
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              await widgets?.requestPayment({
                // Todo 확인!! type
                orderId: generateRandomString(), // 고유 주문 번호
                orderName: orderName,
                successUrl: window.location.origin + "/order/complete", // 결제 요청이 성공하면 리다이렉트되는 URL
                failUrl: window.location.origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
                // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
                // customerMobilePhone: "01012341234",
              });
            } catch (error) {
              // 에러 처리하기
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
