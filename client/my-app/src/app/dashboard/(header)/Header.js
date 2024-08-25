import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faTriangleExclamation,
  faShield,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [totalCount, setTotalCount] = useState([]);
  const [greenStatusData, setGreenStatusData] = useState([]);
  const [greenStatusHeadersData, setGreenStatusHeadersData] = useState([]);
  const [extinctData, setExtinctData] = useState([]);
  const [extinctHeadersData, setExtinctHeadersData] = useState([]);
  const [endangeredData, setEndangeredData] = useState([]);
  const [endangeredHeadersData, setEndangeredHeadersData] = useState([]);
  useEffect(() => {
    const handleFetchTotalSpeciesCount = async () => {
      await axios({
        method: "GET",
        url: `https://api.iucnredlist.org/api/v4/statistics/count`,
        headers: {
          Authorization: "kZex9UPLnqhro8tfxj4LAiDtkEsw6E5827SK",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res.data);
          setTotalCount(res.data);
          alert("Count Details fetched successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    };
    handleFetchTotalSpeciesCount();
  }, []);

  useEffect(() => {
    const handleFetchGreenSpeciesData = async () => {
      await axios({
        method: "GET",
        url: `https://api.iucnredlist.org/api/v4/green_status/all`,
        headers: {
          Authorization: "kZex9UPLnqhro8tfxj4LAiDtkEsw6E5827SK",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log(res.headers);
          setGreenStatusData(res.data);
          setGreenStatusHeadersData(res.headers);
          alert("Green species details fetched successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    };
    handleFetchGreenSpeciesData();
  }, []);

  useEffect(() => {
    const handleFetchExtinctSpeciesData = async () => {
      await axios({
        method: "GET",
        url: `https://api.iucnredlist.org/api/v4/taxa/possibly_extinct_in_the_wild`,
        headers: {
          Authorization: "kZex9UPLnqhro8tfxj4LAiDtkEsw6E5827SK",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log(res.headers);
          setExtinctData(res.data);
          setEndangeredHeadersData(res.headers);
          alert("Extinct species details fetched successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    };
    handleFetchExtinctSpeciesData();
  }, []);
  return (
    <div className="flex w-full bg-white rounded-md border py-3 h-[15%] items-center">
      <nav className="flex flex-1 flex-row justify-around items-center">
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              className="text-orange-400 text-5xl"
              icon={faListCheck}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-semibold text-orange-400">
              Total assessed species
            </p>
            <p className="text-2xl font-bold text-orange-400">100000</p>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              className="text-green-600 text-5xl"
              icon={faShield}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-semibold text-green-600">
              Green list species
            </p>
            <p className="text-2xl font-bold text-green-600">500</p>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              className="text-red-600 text-5xl"
              icon={faTriangleExclamation}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-semibold text-red-600">
              Extincted species
            </p>
            <p className="text-2xl font-bold text-red-600 ">300</p>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Header;
