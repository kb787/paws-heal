"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleList,
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const TaskAnalytics = () => {
  const taskData = [
    {
      name: "Total",
      count: 600,
    },
    {
      name: "Resolved Tasks",
      count: 450,
    },
    {
      name: "Unresolved Tasks",
      count: 150,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-3 gap-[3%] my-[2%]">
        <div className="rounded-lg p-[0.5%]">
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div>Total Tasks</div>
              <div>100</div>
            </div>
            <FontAwesomeIcon icon={faRectangleList} />
          </div>
        </div>
        <div className="rounded-lg p-[0.5%]">
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div>Resolved Tasks</div>
              <div>70</div>
            </div>
            <FontAwesomeIcon icon={faSquareCheck} />
          </div>
        </div>
        <div className="rounded-lg p-[0.5%]">
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div>Unresolved Tasks</div>
              <div>30</div>
            </div>
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
        </div>
      </div>
      <div className="flex gap-[2%] w-[100%] my-[2%]">
        <div className="w-[100%] rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={150} height={40} data={taskData}>
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;
