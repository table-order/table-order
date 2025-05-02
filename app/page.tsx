import FixedBottomCTA from "./components/FixedBottomCTA";
import MainFooter from "./components/MainFooter";
import MenuList from "./components/MenuList";
import NavBar from "./components/NavBar";
import UserCount from "./components/UserCount";

export default function Home() {
  return (
    <div>
      <main className="">
        <div className="flex justify-between py-7 px-6">
          <div className="flex flex-col">
            <span className="text-22 text-tossgray-900 font-bold">
              포스트버거(Post Burger)
            </span>
            <UserCount />
          </div>
          <p className="text-13 text-tossgray-600">기본홀 3번</p>
        </div>
        <NavBar />
        <MenuList />
        <MainFooter />
      </main>
      <FixedBottomCTA defaultRoute="/cart" buttonText="장바구니 보기" />
    </div>
  );
}
