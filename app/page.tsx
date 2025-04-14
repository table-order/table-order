// import MenuList from "./components/MenuList";

// export default function Home() {
//   return (
//     <div>
//       <main>
//         <div className="flex justify-between">
//           <p>가게 이름</p>
//           <p>기본홀 3번</p>
//         </div>
//         <div>네브바</div>
//         <div>공지</div>
//         <MenuList />
//       </main>
//     </div>
//   );
// }
import MenuList from "./components/MenuList";

export default function Home() {
  return (
    <div>
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-semibold">포스트버거</p>
          <p className="text-sm font-semibold text-slate-400">기본홀 3번</p>
        </div>
        {/* <div>공지</div> */}
        <div>nav bar</div>
        <MenuList />
      </main>
    </div>
  );
}
