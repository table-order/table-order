"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";

export default function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex justify-between items-center p-1 text-slate-600">
      {pathname !== "/" && (
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="size-8" />
        </button>
      )}
      <p className="ml-auto font-semibold p-1">주문내역</p>
    </div>
  );
}
