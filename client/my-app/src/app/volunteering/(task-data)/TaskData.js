const TaskData = () => {
    const taskData = [
        {
            id:10,
            taskName:'Stop Poaching',
            taskLocation:'ABC'
        },
        {
            id:11,
            taskName:'Rescue Animal',
            taskLocation:'XYZ'
        },
        {
            id:12,
            taskName:'Rescue Animal',
            taskLocation:'DEF'
        },
        {
            id:13,
            taskName:'Provide Facilities',
            taskLocation:'HJK'
        },
        {
            id:14,
            taskName:'Rescue Animal',
            taskLocation:'LMO'
        },
        {
            id:15,
            taskName:'Prevent Killing',
            taskLocation:'DEF'
        }
    ]
    return (
        <div className = "grid grid-cols-3 gap-[3%]">
            {
                taskData.map((item) => (
                   <div key = {item.id} className = "rounded-xl border border-white flex justify-center items-center bg-[#302c54] w-72 h-32 p-[0.5%]">
                      <div className = 'flex flex-col'>
                          <div className = 'flex flex-row gap-[0.5%]'>
                              <p className = 'text-white text-base'>
                                  Name :
                              </p>
                              <p className = 'text-white text-base'>
                                   {item.taskName}
                              </p>     
                          </div> 
                          <div className = 'flex flex-row gap-[2%]'>
                              <p className = 'text-white text-base'>
                                  Location :
                              </p>
                              <p className = 'text-white text-base'>
                                   {item.taskLocation}
                              </p>     
                          </div>   
                      </div>  
                   </div> 
                )
                )
            }
        </div>
    )
}

export default TaskData ;