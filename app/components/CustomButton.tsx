import { ReactNode } from "react";

export default function CustomButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <div className="fixed bottom-10 left-0 right-0 bg-white p-6">
      <button
        onClick={onClick}
        className="py-3 w-full font-semibold text-white rounded-xl bg-blue-500"
      >
        {children}
      </button>
    </div>
  );
}
