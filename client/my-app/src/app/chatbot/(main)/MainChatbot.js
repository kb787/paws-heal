"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faPaperclip,
  faRightFromBracket,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
const MainChatbot = () => {
  const [chatInput, setChatInput] = useState("");
  const [showMicAlert, setShowMicAlert] = useState(false);
  const [showUploadAlert, setShowUploadAlert] = useState(false);
  const [showChatAlert, setShowChatAlert] = useState(false);

  const headingItems = [
    {
      id: 1,
      value: "What is wildlife conservation, and why is it important?",
    },
    {
      id: 2,
      value: "What are the most endangered animals in the world?",
    },
    {
      id: 3,
      value: "How many species are there on Earth?",
    },
    {
      id: 4,
      value:
        "What is the difference between a wildlife sanctuary and a national park?",
    },
    {
      id: 5,
      value: "What are keystone species, and why are they important?",
    },
    {
      id: 6,
      value: "What do elephants eat, and where do they live?",
    },
  ];
  return (
    <div className="w-[90%] p-[2%]">
      <h1 className="text-center text-3xl font-bold text-white">
        Welcome to{" "}
        <FontAwesomeIcon
          icon={faRobot}
          className="text-3xl font-bold text-white ml-[0.5%]"
        />{" "}
        Chatbot section
      </h1>
      <h3 className="text-left text-lg font-normal text-white mt-[2%]">
        Some frequently asked questions
      </h3>
      <div className="grid grid-cols-3 gap-[0.5%] mt-[2%]">
        {headingItems?.map((item) => (
          <div
            key={item.id}
            className="flex border border-white rounded-xl p-2 justify-center items-center w-[85%] h-24 mb-[5%] bg-[#302c54]"
          >
            <p className="text-white text-md">{item.value}</p>
          </div>
        ))}
      </div>
      <div class="my-[2%]">
        <div>
          <textarea
            class="form-control"
            placeholder="Write your query here"
            aria-label="With textarea"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full h-52 border rounded-xl border-white flex justify-right items-start p-[2%] text-base"
          />

          <div className="flex gap-[2%] mt-[-3%] mb-[3%] mr-[1%] justify-end items-end">
            <div className="relative">
              <FontAwesomeIcon
                icon={faPaperclip}
                className="text-black text-2xl"
                onMouseEnter={() => setShowUploadAlert(true)}
                onMouseLeave={() => setShowUploadAlert(false)}
              />
              {showUploadAlert && (
                <p className="absolute top-full left-1/2 transform -translate-x-1/2 text-white text-xs p-0.5 rounded-md bg-black mt-1 w-28 text-center">
                  Upload File
                </p>
              )}
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="text-black text-2xl"
                onMouseEnter={() => setShowChatAlert(true)}
                onMouseLeave={() => setShowChatAlert(false)}
              />
              {showChatAlert && (
                <p className="absolute top-full left-1/2 transform -translate-x-1/2 text-white text-xs p-0.5 rounded-md bg-black mt-1 w-28 text-center">
                  Send Message
                </p>
              )}
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faMicrophone}
                className="text-black text-2xl"
                onMouseEnter={() => setShowMicAlert(true)}
                onMouseLeave={() => setShowMicAlert(false)}
              />
              {showMicAlert && (
                <p className="absolute top-full left-1/2 transform -translate-x-1/2 text-white text-xs p-0.5 rounded-md bg-black mt-1 w-28 text-center">
                  Record Message
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChatbot;
