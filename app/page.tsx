import MenuList from "./components/MenuList";

export default function Home() {
  return (
    <div>
      <main>
        <div className="flex justify-between">
          <p>가게 이름</p>
          <p>기본홀 3번</p>
        </div>
        <div>네브바</div>
        <div>공지</div>
        <MenuList />
      </main>
    </div>
  );
}
