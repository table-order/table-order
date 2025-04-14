import MenuItem from "./MenuItem";

export const menuData = [
  {
    id: 1,
    name: "POST PREMIUM 오리지날 치즈 버거",
    price: 11500,
    description: "단품: 햄버거",
    imageUrl: "/images/burger.jpg",
    category: "단품",
  },
  {
    id: 2,
    name: "POST PREMIUM 치즈 버거 세트",
    price: 14000,
    description: "세트: 햄버거+음료+케이준프라이",
    imageUrl: "/images/burger.jpg",
    category: "세트",
  },
  {
    id: 3,
    name: "케이준프라이",
    price: 3000,
    imageUrl: "/images/cajun-fries.jpg",
    description: "케이준프라이(150g)",
    category: "사이드",
  },
  {
    id: 4,
    name: "제로콜라",
    price: 2000,
    imageUrl: "/images/zero-cola.jpg",
    description: "제로콜라(355ml)",
    category: "음료",
  },
  {
    id: 5,
    name: "POST PREMIUM 오리지날 치즈 버거",
    price: 11500,
    description: "단품: 햄버거",
    imageUrl: "/images/burger.jpg",
    category: "단품",
  },
  {
    id: 6,
    name: "POST PREMIUM 오리지날 치즈 버거",
    price: 11500,
    description: "단품: 햄버거",
    imageUrl: "/images/burger.jpg",
    category: "단품",
  },
  {
    id: 7,
    name: "POST PREMIUM 오리지날 치즈 버거",
    price: 11500,
    description: "단품: 햄버거",
    imageUrl: "/images/burger.jpg",
    category: "단품",
  },
  {
    id: 8,
    name: "POST PREMIUM 오리지날 치즈 버거",
    price: 11500,
    description: "단품: 햄버거",
    imageUrl: "/images/burger.jpg",
    category: "단품",
  },
];

export default function MenuList() {
  const groupedMenuData = menuData.reduce((acc, menu) => {
    if (!acc[menu.category]) {
      acc[menu.category] = [];
    }
    acc[menu.category].push(menu);
    return acc;
  }, {} as Record<string, typeof menuData>);

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(groupedMenuData).map(([category, menus]) => (
        <div key={category} id={category}>
          <h2 className="text-xl font-bold mb-4 text-slate-700">{category}</h2>
          <div className="flex flex-col gap-4">
            {menus.map((menu) => (
              <MenuItem key={menu.id} menu={menu} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
