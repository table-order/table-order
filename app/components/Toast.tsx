"use client";
import { ToastType } from "../store/toastStore";

type Props = {
  //   id: string;
  type: ToastType;
  message: string;
};
export default function Toast({ message, type }: Props) {
  return (
    <div className="flex justify-center fixed bottom-24 w-full z-200 font-medium text-sm">
      <div className="rounded-3xl bg-tossgray-500 text-white p-4 flex items-center gap-2">
        <span>
          {type === "success" ? (
            <div className="bg-green-500 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          )}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}
