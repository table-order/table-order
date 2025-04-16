import MenuDetailContent from "@/app/components/MenuDetailContent";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const menuId = parseInt(id, 10);
  const { data: menu } = await supabase
    .from("MenuItem")
    .select()
    .eq("id", menuId)
    .single();
  if (!menu) {
    return <div>메뉴를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div className="relative w-full h-80">
        <Image
          src={menu.imageUrl}
          alt="burger"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <MenuDetailContent menu={menu} />
    </div>
  );
}
