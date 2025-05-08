"use client";

import { useUserStore } from "../store/userStore";

export default function UserCount() {
  const users = useUserStore((state) => state.users);

  return users.length > 1 ? (
    <span className="text-17 text-tossgray-800 font-medium">
      멤버 {users.length}명과{" "}
      <span className="text-tossblue-500">함께 주문중</span>
    </span>
  ) : (
    <span className="text-17 text-tossgray-800 font-medium">
      멤버도 QR 찍고 <span className="text-tossblue-500">함께 주문</span>해요
    </span>
  );
}
