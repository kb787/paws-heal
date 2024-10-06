"use client";
import React from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState } from "react";

const BarGraph = () => {
  const [selectedDuration, setSelectedDuration] = useState("60");

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

  const data = [
    { name: "1964", pv: 12 },
    { name: "1974", pv: 15 },
    { name: "1984", pv: 18 },
    { name: "1994", pv: 12 },
    { name: "2004", pv: 14 },
    { name: "2014", pv: 25 },
    { name: "2024", pv: 20 },
  ];
  const fiftyYearsData = [
    { name: "1974", pv: 18 },
    { name: "1984", pv: 18 },
    { name: "1994", pv: 12 },
    { name: "2004", pv: 14 },
    { name: "2014", pv: 25 },
    { name: "2024", pv: 20 },
  ];

  const thirtyYearsData = [
    { name: "1994", pv: 12 },
    { name: "2000", pv: 14 },
    { name: "2006", pv: 25 },
    { name: "2012", pv: 18 },
    { name: "2018", pv: 18 },
    { name: "2024", pv: 20 },
  ];

  const fourtyYearsData = [
    { name: "1984", pv: 18 },
    { name: "1992", pv: 12 },
    { name: "2000", pv: 14 },
    { name: "2008", pv: 25 },
    { name: "2016", pv: 15 },
    { name: "2024", pv: 20 },
  ];

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
  Z`;
  };

  const getGraphData = (duration) => {
    if (duration === "60") {
      return data;
    } else if (duration === "50") {
      return fiftyYearsData;
    } else if (duration === "40") {
      return fourtyYearsData;
    } else if (duration === "30") {
      return thirtyYearsData;
    }
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };
  return (
    <div className="flex flex-col bg-[#302c54] py-[3%] rounded-md border h-[99%] w-[100%] px-[2%]">
      <h2 className="text-2xl font-bold text-white mb-4 text-left">
        Nature's SOS: The Ebb and Flow of Threatened Species
      </h2>
      <div className="flex gap-[0.20%] justify-start">
        <p className="text-left text-white text-base font-medium whitespace-nowrap mr-4">
          Select Duration:
        </p>
        <select
          className="form-select w-[10%] rounded-md px-2 py-1"
          aria-label="Duration select"
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
        >
          <option value="60" selected>
            60
          </option>
          <option value="50">50</option>
          <option value="40">40</option>
          <option value="30">30</option>
        </select>
      </div>
      <div className="flex justify-center items-center my-[3%]">
        <BarChart
          width={800}
          height={400}
          data={getGraphData(selectedDuration)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Bar
            dataKey="pv"
            fill="#8884d8"
            shape={<TriangleBar />}
            label={{ position: "top" }}
            stroke="#ffffff"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default BarGraph;
