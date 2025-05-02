import { create } from "zustand";
// import {
//   RealtimeChannel,
// //   RealtimeChannelOptions,
// //   RealtimeClient,
// //   RealtimeClientOptions,
// } from "@supabase/realtime-js";
//TODO: realtime채널 타입 맞는지 확인필요
import { type RealtimeChannel } from "@supabase/supabase-js";
type ChannelStore = {
  channels: Record<string, RealtimeChannel>;
  addChannel: (name: string, channel: RealtimeChannel) => void;
  removeChannel: (name: string) => void;
};
export const useChannelStore = create<ChannelStore>((set) => ({
  channels: {},

  //채널추가
  addChannel: (name, channel) =>
    set((state) => ({ channels: { ...state.channels, [name]: channel } })),

  //해당이름 채널 제거
  removeChannel: (name) =>
    set((state) => ({
      channels: Object.fromEntries(
        Object.entries(state.channels).filter(([key]) => name !== key)
      ),
    })),
}));
