"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faRobot,
  faBuildingColumns,
  faHandshakeAngle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div className="flex justify-center w-[15%] min-h-screen rounded-md border bg-[#302c54]">
      <div className="flex flex-col my-2 text-center">
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md p-3">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="text-sm font-medium"
            />
          </div>
          <p className="font-medium text-sm text-center text-white">
            Dashboard
          </p>
        </div>
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md py-3 px-2.5">
            <FontAwesomeIcon icon={faRobot} className="text-sm font-medium" />
          </div>
          <p className="font-medium text-sm text-center text-white">Chatbot</p>
        </div>
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md p-3">
            <FontAwesomeIcon
              icon={faBuildingColumns}
              className="text-sm font-medium"
            />
          </div>
          <p className="font-medium text-sm text-center text-white">Funding</p>
        </div>
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md py-3 px-2.5">
            <FontAwesomeIcon
              icon={faHandshakeAngle}
              className="text-sm font-medium"
            />
          </div>
          <p className="font-medium text-sm text-center text-white">
            Volunteering
          </p>
        </div>
        {/* <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md py-3 px-3">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-sm font-medium"
            />
          </div>
          <p className="font-medium text-sm text-center text-white">
            Red Alert
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
