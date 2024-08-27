import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import LineChartComponent from "./(line-chart)/LineChart";

const Analytics = () => {
  const [threatsData, setThreatsData] = useState([]);

  useEffect(() => {
    async function fetchThreatCategories() {
      try {
        const response = await axios.get(
          "https://api.iucnredlist.org/api/v4/threats/"
        );
        const threatCodes = response.data.map((item) => item.code);
        const threatCounts = {};
        for (const code of threatCodes) {
          const response = await axios.get(
            `https://api.iucnredlist.org/api/v4/threats/${code}`
          );
          const totalCount = parseInt(response.headers["total-count"], 10);
          threatCounts[code] = totalCount;
        }
        const sortedThreats = Object.entries(threatCounts).sort(
          (a, b) => b[1] - a[1]
        );

        console.log("Top 5 Threat Categories with Maximum Count:");
        for (const [code, count] of sortedThreats.slice(0, 5)) {
          console.log(`${code}: ${count}`);
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    }
    fetchThreatCategories;
  }, []);
  const sampleData = [
    { name: "A", users: 130, color: "rgb(251 146 60)" },
    { name: "B", users: 60, color: "rgb(22 163 74)" },
    { name: "C", users: 45, color: "rgb(220 38 38)" },
  ];
  return (
    <div className="flex flex-row justify-start gap-[1%] my-[2%]">
      <div className="flex flex-col bg-white py-[3%] rounded-md border h-[99%] w-[49%] justify-start items-start px-[2%]">
        <p className="text-3xl font-bold text-red-600 text-center">
          Red Alert Species
        </p>
        <div className="flex mx-[25%] items-center">
          <PieChart width={350} height={350}>
            <Pie
              data={sampleData}
              dataKey="users"
              outerRadius={120}
              Piefill="#ffff"
            >
              {sampleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="flex flex-col justify-start my-[0.35%] mb-4">
          <div className="text-2xl font-bold text-center text-red-800 my-[0.5%]">
            Top 3 categories with maximum count
          </div>
          <div className="flex flex-row gap-[2%] justify-start mt-[2%]">
            <p className="text-custom-color-one font-light text-xl">
              Endangered:
            </p>
            <p className="text-custom-color-one font-bold text-xl">800</p>
          </div>
          <div className="flex flex-row gap-[2%] justify-start">
            <p className="text-custom-color-two font-light text-xl">
              Least Concern:
            </p>
            <p className="text-custom-color-two font-bold text-xl">400</p>
          </div>
          <div className="flex flex-row gap-2 justify-start">
            <p className="text-custom-color-three font-light text-xl">
              Near Threatened:
            </p>
            <p className="text-custom-color-three font-bold text-xl">250</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-white rounded-md py-[3%] h-[99%] w-[50%] justify-center items-center px-[2%]">
        <LineChartComponent />
        <div className="flex flex-col my-[3%]">
          <p className="text-left text-2xl font-extrabold text-custom-color-two">
            Recent trends in green list species count
          </p>
          <p className="text-left text-xl font-medium text-custom-color-two">
            Analyzing data of last 60 years
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
