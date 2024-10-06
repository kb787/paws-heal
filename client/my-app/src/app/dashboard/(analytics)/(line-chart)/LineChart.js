import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const data = [
  { name: "1964", pv: 95 },
  { name: "1974", pv: 85 },
  { name: "1984", pv: 72 },
  { name: "1994", pv: 67 },
  { name: "2004", pv: 78 },
  { name: "2014", pv: 55 },
  { name: "2024", pv: 38 },
];

const thirtyYearsData = [
  { name: "1994", pv: 67 },
  { name: "2004", pv: 78 },
  { name: "2014", pv: 55 },
  { name: "2024", pv: 38 },
];

const twentyYearsData = [
  { name: "2004", pv: 78 },
  { name: "2014", pv: 55 },
  { name: "2024", pv: 38 },
];

const criticallyEndangeredSixty = [
  { name: "1964", pv: 90 },
  { name: "1974", pv: 80 },
  { name: "1984", pv: 120 },
  { name: "1994", pv: 130 },
  { name: "2004", pv: 100 },
  { name: "2014", pv: 120 },
  { name: "2024", pv: 150 },
];

const criticallyEndangeredThirty = [
  { name: "1994", pv: 130 },
  { name: "2004", pv: 100 },
  { name: "2014", pv: 120 },
  { name: "2024", pv: 150 },
];

const criticallyEndangeredTwenty = [
  { name: "2004", pv: 100 },
  { name: "2014", pv: 120 },
  { name: "2024", pv: 150 },
];

const vulnerableSixty = [
  { name: "1964", pv: 120 },
  { name: "1974", pv: 100 },
  { name: "1984", pv: 140 },
  { name: "1994", pv: 135 },
  { name: "2004", pv: 110 },
  { name: "2014", pv: 135 },
  { name: "2024", pv: 125 },
];

const vulnerableThirty = [
  { name: "1994", pv: 135 },
  { name: "2004", pv: 110 },
  { name: "2014", pv: 135 },
  { name: "2024", pv: 125 },
];

const vulnerableTwenty = [
  { name: "2004", pv: 110 },
  { name: "2014", pv: 135 },
  { name: "2024", pv: 125 },
];

const getChartData = (duration, species) => {
  if (duration === "60" && species === "green-list") {
    return data;
  } else if (duration === "30" && species === "green-list") {
    return thirtyYearsData;
  } else if (duration === "20" && species === "green-list") {
    return twentyYearsData;
  } else if (duration === "60" && species === "critically-endangered") {
    return criticallyEndangeredSixty;
  } else if (duration === "30" && species === "critically-endangered") {
    return criticallyEndangeredThirty;
  } else if (duration === "20" && species === "critically-endangered") {
    return criticallyEndangeredTwenty;
  } else if (duration === "60" && species === "vulnerable") {
    return vulnerableSixty;
  } else if (duration === "30" && species === "vulnerable") {
    return vulnerableThirty;
  } else if (duration === "20" && species === "vulnerable") {
    return vulnerableTwenty;
  }
};
const LineChartComponent = () => {
  const [selectedInterval, setSelectedInterval] = useState("60");
  const [selectedSpeciesType, setSelectedSpeciesType] = useState("green-list");

  return (
    <div className="flex flex-col bg-[#302c54] py-[3%] rounded-md border h-[99%] w-[51%] justify-start items-start px-[2%]">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={getChartData(selectedInterval, selectedSpeciesType)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", border: "none" }}
            labelStyle={{ color: "#ffffff" }}
            itemStyle={{ color: "#ffffff" }}
          />
          <Line type="monotone" dataKey="pv" stroke="#ffffff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-[5%] w-full my-[6%]">
        <div className="flex gap-[0.15%]">
          <p className="text-left text-white text-lg font-medium whitespace-nowrap mr-4">
            Duration:
          </p>
          <select
            className="form-select w-[95%] rounded-md px-2 py-1"
            aria-label="Duration select"
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
          >
            <option value="60" selected>
              60
            </option>
            <option value="30">30</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="flex gap-[0.15%]">
          <p className="text-left text-white text-lg font-medium whitespace-nowrap mr-4">
            Species Type:
          </p>
          <select
            className="form-select w-[75%] rounded-md px-2 py-1"
            aria-label="Duration select"
            value={selectedSpeciesType}
            onChange={(e) => setSelectedSpeciesType(e.target.value)}
          >
            <option value="green-list" selected>
              Green List
            </option>
            <option value="critically-endangered" selected>
              Crictically Endangered
            </option>
            <option value="vulnerable" selected>
              Vulnerable
            </option>
          </select>
        </div>
      </div>
      <div className="flex flex-col my-[3%]">
        <p className="text-left text-2xl font-extrabold text-white">
          {`Recent trends in ${selectedSpeciesType} species count`}
        </p>
        <p className="text-left text-xl font-medium text-white">
          {`Analyzing data of last ${selectedInterval} years`}
        </p>
      </div>
    </div>
  );
};

export default LineChartComponent;
