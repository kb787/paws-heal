"use client"
import dynamic from "next/dynamic" ;
const TaskAnalytics = dynamic(() => import('../(task-analytics)/TaskAnalytics'), {
    ssr:false
}) ;
const VolunteeringMain = () => {
   return (
      <div className ="flex flex-col">
        <TaskAnalytics/>
      </div>
   ) 
}
export default VolunteeringMain 