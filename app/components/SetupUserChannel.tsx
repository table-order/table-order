"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useChannelStore } from "../store/channelStore";
import { useUserStore } from "../store/userStore";
// import { nanoid } from "nanoid";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";

export default function SetupUserChannel() {
  //채널 생성과 구독 설정하는 컴포넌트
  const supabase = createClient();

  const { addChannel, removeChannel } = useChannelStore();
  const { setUsers } = useUserStore();

  useEffect(() => {
    let userId = getLocalStorage("userId");

    if (!userId) {
      userId = crypto.randomUUID();
      setLocalStorage("userId", userId);
    }
    const tableChannel = supabase.channel("user", {
      config: {
        presence: {
          key: userId, // 유저 구분용 고유 키
        },
      },
    });
    //TODO: tableID로 채널이름 생성

    addChannel("table", tableChannel);
    //채널을 전역채널스토어에 추가

    tableChannel
      .on("presence", { event: "sync" }, () => {
        const newState = tableChannel.presenceState();
        const users = Object.keys(newState).map((id) => ({ id }));
        setUsers(users);

        console.log("현재 접속중인 유저", newState); //접속자 리스트 갱신
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log(`${key}입장`, key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log(`${key}퇴장`, key, leftPresences);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          tableChannel.track({});
        }
      });

    return () => {
      tableChannel.unsubscribe();
    };
  }, [supabase, addChannel, removeChannel, setUsers]);

  return null;
}
