"use client"
import dynamic from "next/dynamic" ;
const TaskAnalytics = dynamic(() => import('../(task-analytics)/TaskAnalytics'), {
    ssr:false
}) ;
const TaskData = dynamic(() => import('../(task-data)/TaskData'))
const VolunteeringMain = () => {
   return (
      <div className ="flex flex-col">
        <div className = "text-start text-white text-xl font-bold px-[3%] pt-[1%]">Volunteering Tasks
         </div> 
        <TaskAnalytics/>
        <div className = "text-start text-white text-xl font-bold px-[3%] pt-[1%]">Recent Tasks
        </div> 
        <TaskData/>
      </div>
   ) 
}
export default VolunteeringMain 