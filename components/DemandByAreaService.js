import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DemandByAreaService() {
  const [data, setData] = useState([]);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await axios.get("/api/admin/insights/demandAreaService");
        setData(
          res.data.demand.map((d) => ({
            name: `${d._id.area} — ${d._id.service}`,
            value: d.count,
          }))
        );
        setInsight(res.data.insight);
      } catch (error) {
        console.error("Error fetching demand insights:", error);
      }
    }
    fetchInsights();
  }, []);

  const chartWidth = Math.max(data.length * 100, 600);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Demand by Area & Service</h2>

      {/* Scrollable only on small screenss */}
      <div className="overflow-x-auto sm:overflow-visible">
        <div
          className="min-w-[600px] max-w-full"
          style={{ width: chartWidth }}
        >
          <BarChart
            width={chartWidth}
            height={300}
            data={data}
            className="transition-transform duration-500 ease-in-out"
          >
            <XAxis
              dataKey="name"
              interval={0}
              tick={({ x, y, payload }) => {
                const lines = payload.value.split(" — ");
                return (
                  <g transform={`translate(${x},${y + 10})`}>
                    {lines.map((line, index) => (
                      <text
                        key={index}
                        x={0}
                        y={index * 12}
                        textAnchor="middle"
                        fill="#666"
                        fontSize="10"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="#2563EB"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-1">AI Insight</h3>
        <p className="text-sm text-gray-700">{insight}</p>
      </div>
    </div>
  );
}

export default DemandByAreaService;
