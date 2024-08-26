"use client";
import Image from "next/image";
import Sidebar from "./dashboard/(sidebar)/Sidebar";
import Content from "./dashboard/(content)/Content";
export default function Home() {
  return (
    <div className="w-full min-h-screen bg-slate-100 py-[0.80%] px-[0.50%]">
      <div className="flex flex-1 flex-row gap-2">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
