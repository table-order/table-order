import MenuList from "./components/MenuList";
import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div>
      <main className="">
        <div className="flex justify-between items-center py-8 px-6">
          <p className="text-[22px] font-semibold">포스트버거(Post Burger)</p>
          <p className="text-[13px] text-[#6b7684]">기본홀 3번</p>
        </div>
        <NavBar />
        <MenuList />
      </main>
    </div>
  );
}
