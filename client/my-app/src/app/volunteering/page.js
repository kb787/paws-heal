import dynamic from "next/dynamic"

const VolunteeringMain = dynamic(() => import('../volunteering/(main-volunteering)/VolunteeringMain'),{
    ssr:false
})
const Sidebar = dynamic(() => import('../dashboard/(sidebar)/Sidebar'))
export default function Main(){
    return (
        <div className = "w-full min-h-screen bg-[#221F3B] py-[0.80%] px-[0.50%]">
             <div className = "flex flex-row flex-1 gap-2">
                 <Sidebar/>
                 <VolunteeringMain/>
             </div>
        </div>
    )
}