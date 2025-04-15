import MenuList from "./components/MenuList";
import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div>
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">포스트버거(Post Burger)</p>
          <p className="text-sm font-semibold text-slate-400">기본홀 3번</p>
        </div>
        <NavBar />
        {/* <div>공지</div> */}
        <MenuList />
      </main>
    </div>
  );
}
