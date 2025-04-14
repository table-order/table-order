import Image from "next/image";
import Link from "next/link";

type MenuProps = {
  menu: {
    id: number;
    name: string;
    price: number;
    description?: string;
    imageUrl: string;
    category: string;
  };
};

function MenuItem({ menu }: MenuProps) {
  return (
    <Link
      href={`/menu/${menu.id}`}
      className="flex items-center justify-between gap-6 cursor-pointer"
    >
      <div className="flex flex-col">
        <h2 className="text-lg whitespace-normal break-words font-semibold">
          {menu.name}
        </h2>
        <p className="font-semibold text-slate-700">
          {menu.price.toLocaleString()}원
        </p>
      </div>
      <div className="block overflow-hidden relative w-[104px] h-[104px] flex-shrink-0 rounded-lg">
        <Image
          src={menu.imageUrl}
          alt={menu.name}
          fill
          className="rounded-lg"
          style={{
            objectFit: "cover",
          }}
        />
        <div
          className="absolute top-0 right-0 bottom-0 left-0 z-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}
        ></div>
      </div>
    </Link>
  );
}

export default MenuItem;
