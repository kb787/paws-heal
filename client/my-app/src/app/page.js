"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
const Content = dynamic(() => import("./dashboard/(content)/Content"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("./dashboard/(sidebar)/Sidebar"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#221F3B] py-[0.80%] px-[0.50%]">
      <div className="flex flex-1 flex-row gap-2">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
