"use client"
import dynamic from "next/dynamic" ;
const Sidebar = dynamic(() => import("../dashboard/(sidebar)/Sidebar"),{
    ssr:false,
})
const MainChatbot = dynamic(() => import("../chatbot/(main)/MainChatbot"),{
    ssr:false
})
export default function Main(){
  return (  
    <div className="w-full min-h-screen bg-[#221F3B] py-[0.80%] px-[0.50%]">
        <div className="flex flex-1 flex-row gap-2">
           <Sidebar/>
           <MainChatbot/>
        </div>
    </div>
  ) 
}