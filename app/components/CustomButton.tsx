import Link from "next/link";

export default function CustomButton({ children }: { children: string }) {
  return (
    <div className="fixed left-0 right-0 bottom-0 p-6 h-[112px] flex justify-center items-center bg-white z-50">
      <button className="py-4 w-full text-17 font-semibold text-xl text-white text-center rounded-2xl bg-tossblue-500 max-w-md">
        <Link href="/" className="flex gap-2 justify-center items-center">
          {children}
        </Link>
      </button>
    </div>
  );
}
