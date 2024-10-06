import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import LineChartComponent from "./(line-chart)/LineChart";

const Analytics = () => {
  const [threatsData, setThreatsData] = useState([]);
  useEffect(() => {
    async function fetchThreatCategories() {
      try {
        const response = await axios.get("/api/proxy/api/v4/threats/");
        console.log(`All possible threats exist as`, response.data);
        const threatCodes = response.data.map((item) => item.code);
        const threatCounts = {};
        for (const code of threatCodes) {
          const response = await axios.get(`/api/proxy/api/v4/threats/${code}`);
          const totalCount = parseInt(response.headers["total-count"], 10);
          threatCounts[code] = totalCount;
        }
        const sortedThreats = Object.entries(threatCounts).sort(
          (a, b) => b[1] - a[1]
        );

        console.log("Top 5 Threat Categories with Maximum Count:");
        for (const [code, count] of sortedThreats.slice(0, 5)) {
          console.log(
            `The top 5 high risk categories exist as : ${code}: ${count}`
          );
        }

        setThreatsData(sortedThreats.slice(0, 5));
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    }

    fetchThreatCategories();
  }, []);

  const sampleData = [
    { name: "A", users: 130, color: "rgb(201, 96, 10)" },
    { name: "B", users: 60, color: "rgb(12, 113, 24)" },
    { name: "C", users: 45, color: "rgb(170, 0, 0)" },
  ];
  return (
    <div className="flex flex-row justify-start gap-[1%] my-[2%]">
      <div className="flex flex-col bg-[#302c54] py-[3%] rounded-md border h-[99%] w-[49%] justify-start items-start px-[2%]">
        <p className="text-3xl font-bold text-white text-center">
          Red Alert Species
        </p>
        <div className="flex justify-center items-center mx-[13%]">
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
          <div className="text-2xl font-bold text-center text-white my-[0.5%]">
            Top 3 categories with maximum count
          </div>
          <div className="flex flex-row gap-[2%] justify-start mt-[2%] border-[#C9600A] border-3 bg-[#C9600A] rounded-xl w-[45%] h-[35%] px-2 py-2">
            <p className="text-white font-light text-xl">Endangered:</p>
            <p className="text-white font-bold text-xl">800</p>
          </div>
          <div className="flex flex-row gap-[2%] mt-[2%] justify-start border-[#0C7118] border-3 bg-[#0C7118] rounded-xl w-[45%] h-[35%] px-2 py-2">
            <p className="text-white font-light text-xl">Secure:</p>
            <p className="text-white font-extrabold text-xl">400</p>
          </div>
          <div className="flex flex-row gap-[2%] mt-[2%] justify-start border-[#AA0000] border-3 bg-[#AA0000] rounded-xl w-[45%] h-[35%] px-2 py-2">
            <p className="text-white font-extrabold text-xl">Threatened:</p>
            <p className="text-white font-extrabold text-xl">250</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-[#302c54] py-[3%] rounded-md border h-[99%] w-[51%] justify-start items-start px-[2%]">
        <LineChartComponent />
        <div className="flex flex-col my-[3%]">
          <p className="text-left text-2xl font-extrabold text-white">
            Recent trends in green list species count
          </p>
          <p className="text-left text-xl font-medium text-white">
            Analyzing data of last 60 years
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
