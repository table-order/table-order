"use client";
import Link from "next/link";
import { useCartStore } from "../store/store";
import FixedBottomCTA from "../components/FixedBottomCTA";
import CustomButton from "../components/CustomButton";
import { useRouter } from "next/navigation";
import { useToastStore } from "../store/toastStore";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { getLocalStorage } from "@/utils/storage";

type Cart = {
  id: number;
  created_at: string;
  name: string;
  price: number;
  quantity: number;
  itemId: number;
  userId: string;
};

export default function CartPage() {
  const { updateQuantity } = useCartStore();
  const [dbCartItems, setDbCartItems] = useState<Cart[]>([]);
  const [myCartItems, setMyCartItems] = useState<Cart[]>([]); // 내 주문
  const [memberCartItems, setMemberCartItems] = useState<Cart[]>([]); // 멤버 주문
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const userId = getLocalStorage("userId");
    const fetchData = async () => {
      const { data, error } = await supabase.from("Cart").select("*"); // Use Cart type
      if (error) {
        console.error("Error fetching initial cart data", error);
      }
      setDbCartItems(data || []);

      // 내 주문과 멤버 주문 구분
      const myItems = data?.filter((item) => item.userId === userId) || [];
      const memberItems = data?.filter((item) => item.userId !== userId) || [];

      setMyCartItems(myItems);
      setMemberCartItems(memberItems);
    };

    fetchData();

    const cartChanges = supabase
      .channel("cart_changes2")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Cart",
        },
        (payload) => {
          console.log("Cart table change:", payload);
          fetchData(); // Re-fetch cart data on changes
        }
      )
      .subscribe();

    return () => {
      cartChanges.unsubscribe();
    };
  }, [supabase]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    const { error: dbError } = await supabase
      .from("Cart")
      .update({ quantity: newQuantity })
      .eq("itemId", itemId);

    if (dbError) {
      console.error("Error updating quantity:", dbError);
      addToast("수량 변경 실패", "error");
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleDeleteFromCart = async (id: number) => {
    const { error: dbError } = await supabase
      .from("Cart")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Error deleting from cart:", dbError);
      addToast("장바구니 삭제 실패", "error");
      return;
    }
    setDbCartItems((prevItems) => prevItems.filter((item) => item.id !== id));

    addToast("메뉴를 삭제했어요", "success");
  };

  return (
    <div id="container" className="font-sans">
      <div id="myMenu" className="px-6 pt-6 pb-4">
        <p className="font-semibold mb-5 text-xl">내 메뉴</p>
        {/* 장바구니 1개 이상이면 아이템 보여주기*/}
        {myCartItems.length ? (
          <div id="items-group">
            {myCartItems.map((item) => (
              <li key={item.id} className="flex items-center mb-5">
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between text-lg font-normal text-gray-800">
                    <span>{item.name}</span>
                    <button id="delete-item" type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        onClick={() => {
                          handleDeleteFromCart(item.id);
                          // removeFromCart(item.id);
                        }}
                        className="size-10 fill-tossgray-300 hover:fill-gray-500 active:fill-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="text-lg font-semibold mb-4 text-gray-800">
                    {(item.quantity * item.price).toLocaleString()}원
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      className="hover:bg-gray-300 active:bg-gray-300 transition font-medium rounded-lg bg-tossgray-400 text-tossgray-600 px-4"
                    >
                      옵션 변경
                    </button>
                    <div
                      id="count-button-group"
                      className="flex rounded-xl gap-1 bg-tossgray-400"
                    >
                      <div id="count-minus" className="flex items-center p-3">
                        <button
                          type="button"
                          // onClick={() => {
                          //   updateQuantity(item.id, item.quantity - 1);
                          // }}
                          onClick={() => {
                            handleUpdateQuantity(
                              item.itemId,
                              item.quantity - 1
                            );
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            className={`size-5 ${
                              item.quantity <= 1
                                ? "stroke-gray-300"
                                : "stroke-gray-500"
                            }`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12h14"
                            />
                          </svg>
                        </button>
                      </div>

                      <div
                        id="count-value"
                        className="justify-center text-center bg-white font-medium text-gray-800 text-xl py-2 my-1 rounded-xl shadow w-12"
                      >
                        {item.quantity}
                      </div>
                      <div id="count-plus" className="flex items-center p-3">
                        <button
                          type="button"
                          // onClick={() => {
                          //   updateQuantity(item.id, item.quantity + 1);
                          // }}
                          onClick={() => {
                            handleUpdateQuantity(
                              item.itemId,
                              item.quantity + 1
                            );
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            className="size-5 stroke-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </div>
        ) : (
          //장바구니 비었을때 표시
          <p className="text-tossgray-500">담은 메뉴가 없어요</p>
        )}
        {memberCartItems.length > 0 && (
          <div className="mt-8">
            <p className="font-semibold mb-5 text-xl">멤버 주문</p>
            <div id="member-items-group">
              {memberCartItems.map((item) => (
                <li key={item.id} className="flex items-center mb-5">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between text-lg font-normal text-gray-800">
                      <span>{item.name}</span>
                      <button id="delete-item" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          onClick={() => {
                            handleDeleteFromCart(item.id);
                          }}
                          className="size-10 fill-tossgray-300 hover:fill-gray-500 active:fill-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="text-lg font-semibold mb-4 text-gray-800">
                      {(item.quantity * item.price).toLocaleString()}원
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        className="hover:bg-gray-300 active:bg-gray-300 transition font-medium rounded-lg bg-tossgray-400 text-tossgray-600 px-4"
                      >
                        옵션 변경
                      </button>
                      <div
                        id="count-button-group"
                        className="flex rounded-xl gap-1 bg-tossgray-400"
                      >
                        <div id="count-minus" className="flex items-center p-3">
                          <button
                            type="button"
                            disabled // 멤버 주문은 수량 변경 불가
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                              className="size-5 stroke-gray-300" // 비활성화 상태
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14"
                              />
                            </svg>
                          </button>
                        </div>

                        <div
                          id="count-value"
                          className="justify-center text-center bg-white font-medium text-gray-800 text-xl py-2 my-1 rounded-xl shadow w-12"
                        >
                          {item.quantity}
                        </div>
                        <div id="count-plus" className="flex items-center p-3">
                          <button
                            type="button"
                            disabled // 멤버 주문은 수량 변경 불가
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                              className="size-5 stroke-gray-300" // 비활성화 상태
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 장바구니 0개면 메뉴추가하기, 1개 이상이면 주문하기 버튼 */}
      {dbCartItems.length > 0 ? (
        <>
          <div
            id="go-to-menu-group"
            className="hover:bg-gray-200 active:bg-gray-200"
          >
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-center my-3">
              <Link
                href="/"
                className=" text-blue-500 text-lg font-normal hover:bg-gray-300 rounded-lg py-2 px-4
            active:text-sm transition-transform duration-100"
                style={{ minHeight: "44px" }}
              >
                메뉴 더 추가 +
              </Link>
            </div>
            <div className="bg-gray-100 h-[16px]"></div>
          </div>
          <FixedBottomCTA
            onClick={() => {
              //TODO: 모달창 띄우기
              router.push("/order/checkout");
            }}
            buttonText="주문하기"
          />
        </>
      ) : (
        <CustomButton>메뉴 추가하기</CustomButton>
      )}
    </div>
  );
}
