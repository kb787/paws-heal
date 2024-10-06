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

const data = [
  { name: "1974", pv: 1000 },
  { name: "1984", pv: 700 },
  { name: "1994", pv: 1200 },
  { name: "2004", pv: 900 },
  { name: "2014", pv: 1000 },
  { name: "2024", pv: 500 },
];

const LineChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
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
  );
};

export default LineChartComponent;
