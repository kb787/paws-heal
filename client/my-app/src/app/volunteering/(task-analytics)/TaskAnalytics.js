"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleList,
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
const TaskAnalytics = () => {
  const taskData = [
    {
      time: "12 months",
      count: 600,
    },
    {
      time: "6 months",
      count: 450,
    },
    {
      time: "3 months",
      count: 150,
    },
    {
       time: "1 month",
       count: 80,
    },
    {
       time: "15 days",
       count: 50,
    },
    {
       time: "5 days",
       count: 20  
    }
  ];
  return (
    <div>
      <div className="flex justify-center items-center gap-[5%] my-[2%] w-[100%] mx-[15%]">
        <div className="rounded-lg  bg-[#302c54] w-56 h-24 flex justify-center items-center border border-white ">
          <div className="flex flex-row gap-[2%]">
            <FontAwesomeIcon
              icon={faRectangleList}
              className="text-lg text-white mt-[2.5%]"
            />
            <div className="text-lg text-white font-semibold ml-[5%]">
              Total:
            </div>

            <div className="text-lg text-white font-semibold flex justify-start">
              100
            </div>
          </div>
        </div>
        <div className="rounded-lg  bg-[#302c54] w-56 h-24 flex justify-center items-center border border-white ">
          <div className="flex flex-row gap-[2%]">
            <FontAwesomeIcon
              icon={faSquareCheck}
              className="text-lg text-white mt-[2.5%]"
            />
            <div className="text-lg text-white font-semibold ml-[5%]">
              Resolved:
            </div>
            <div className="text-lg text-white font-semibold flex justify-start">
              70
            </div>
          </div>
        </div>
        <div className="rounded-lg  bg-[#302c54] w-56 h-24 flex justify-center items-center border border-white ">
          <div className="flex flex-row gap-[2%]">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-lg text-white mt-[2.5%]"
            />
            <div className="text-lg text-white font-semibold ml-[5%]">
              Unresolved:
            </div>

            <div className="text-lg text-white font-semibold flex justify-start">
              30
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-[2%] w-[100%] my-[7%] justify-center items-center mx-[15%]">    
        <div className="w-[100%] h-[380px] rounded-lg border-white border bg-[#302c54] ml-[4%] p-[0.5%] ">
          <ResponsiveContainer height="100%" className = "my-[0.5%]">
            <BarChart data={taskData}>
              <XAxis
                dataKey="time"
                tick={{ fill: "#fff" }}
                axisLine={{ stroke: "#fff" }}
              >
              </XAxis>
              <YAxis tick={{ fill: "#fff" }} axisLine={{ stroke: "#fff" }}/>   
              <Tooltip />
              <Bar dataKey="count" fill="#221F3B" width={20} />
            </BarChart>
          </ResponsiveContainer>
          <h2 className = "text-white text-lg font-semibold my-[1.5%]">Unresolved tasks trend</h2>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;
