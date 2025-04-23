export type BadgeType = "인기" | "신규" | "없음";

const badgeStyles: Record<BadgeType, { textColor: string; bgColor: string }> = {
  // 필수: {
  //   textColor: "text-[#d22030]",
  //   bgColor: "bg-[#f4433629]",
  // },
  // 선택: {
  //   textColor: "text-[#1b64da]",
  //   bgColor: "bg-[#3182f629]",
  // },
  인기: {
    textColor: "text-[#FFFFFF]",
    bgColor: "bg-[#3182F6]",
  },
  신규: {
    textColor: "text-[#FFFFFF]",
    bgColor: "bg-[#F04452]",
  },
  없음: {
    textColor: "",
    bgColor: "",
  },
};

interface CustomBadgeProps {
  type: BadgeType;
}

export default function CustomBadge({ type = "없음" }: CustomBadgeProps) {
  const { textColor, bgColor } = badgeStyles[type];
  if (type === "없음") {
    return null;
  }

  return (
    <span
      className={`inline-flex justify-center items-center px-[7px] py-[4px] rounded-[11px] w-fit text-xs font-bold ${textColor} ${bgColor}`}
    >
      {type}
    </span>
  );
}
