"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import CallButton from "./CallButton";

export default function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/order/complete") return;
  if (pathname === "/order/history") {
    return (
      <div className="flex items-center p-3 text-slate-600">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="size-8" />
        </button>
      </div>
    );
  }
  return (
    <div
      className={`flex items-center p-3 text-slate-600 ${
        pathname === "/cart" ? "grid grid-cols-3" : "justify-between"
      }`}
    >
      {pathname === "/" && <CallButton />}
      {pathname !== "/" && (
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="size-8" />
        </button>
      )}

      {pathname === "/cart" ? (
        <p className="text-17 font-semibold p-1 text-center col-start-2">
          장바구니
        </p>
      ) : (
        <p className="ml-auto text-17 text-tossgray-800 font-semibold p-1">
          <Link href="/order/history">주문내역</Link>
        </p>
      )}
    </div>
  );
}
