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
    <div className="flex justify-center w-[15%] min-h-screen rounded-md border bg-white">
      <div className="flex flex-col my-2 text-center">
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md p-3">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="text-xl font-medium"
            />
          </div>
          <p className="font-medium text-xl text-center">Dashboard</p>
        </div>
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md py-3 px-2.5">
            <FontAwesomeIcon icon={faRobot} className="text-xl font-medium" />
          </div>
          <p className="font-medium text-xl text-center">Chatbot</p>
        </div>
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md p-3">
            <FontAwesomeIcon
              icon={faBuildingColumns}
              className="text-xl font-medium"
            />
          </div>
          <p className="font-medium text-xl text-center">Funding</p>
        </div>
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md py-3 px-2.5">
            <FontAwesomeIcon
              icon={faHandshakeAngle}
              className="text-xl font-medium"
            />
          </div>
          <p className="font-medium text-xl text-center">Volunteering</p>
        </div>
        <div className="flex flex-row gap-2 my-3 text-center items-center">
          <div className="flex items-center justify-center bg-gray-50 border rounded-md py-3 px-3">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-xl font-medium"
            />
          </div>
          <p className="font-medium text-xl text-center">Red Alert</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
