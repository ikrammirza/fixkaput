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
        const res = await axios.get("/api/admin/insights/demandAreaService", { withCredentials: true });
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

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Demand by Area & Service</h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 10 }}
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
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-1">AI Insight</h3>
        <p className="text-sm text-gray-700">{insight}</p>
      </div>
    </div>
  );
}

export default DemandByAreaService;
