"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useChannelStore } from "../store/channelStore";
import { getLocalStorage } from "@/utils/storage";
import { useToastStore } from "../store/toastStore";

export default function SetupCartChannel() {
  const supabase = createClient();
  const addChannel = useChannelStore((state) => state.addChannel);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    const cartChannel = supabase.channel("cart_channel");

    addChannel("cart_channel", cartChannel);
    //채널을 전역채널스토어에 추가

    const myId = getLocalStorage("userId");

    cartChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Cart",
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              if (myId !== payload.new.userId) {
                addToast(`ch: 멤버가 ${payload.new.name}메뉴를 추가했어요`);
              } else {
                addToast("ch: 메뉴를 추가했어요");
              }
              // console.log("ch: 추가된 장바구니 아이템:", payload.new);
              break;
            case "DELETE":
              if (myId !== payload.old.clickedUserId) {
                addToast(`ch: 멤버가 ${payload.old.name}메뉴를 삭제했어요`);
              } else {
                addToast("ch: 메뉴를 삭제했어요");
              }
              //addToast(`멤버가 ${payload.old.name}메뉴를 삭제했어요`);

              // console.log("ch: 삭제된 장바구니 아이템 전체 정보:", payload.old);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      cartChannel.unsubscribe();
      //removeChannel("cart_channel")
    };
  }, [supabase, addChannel, addToast]);

  return null;
}
