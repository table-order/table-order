import MenuDetailContent from "@/app/components/MenuDetailContent";
import { menuData } from "@/app/components/MenuList";
import Image from "next/image";

export default function MenuDetailPage({ params }: { params: { id: string } }) {
  const menuId = parseInt(params.id, 10);
  const menu = menuData.find((item) => item.id === menuId);

  if (!menu) {
    return <div>메뉴를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div className="relative w-full h-80">
        <Image src={menu.imageUrl} alt="burger" fill objectFit="cover" />
      </div>
      <MenuDetailContent menu={menu} />
    </div>
  );
}
