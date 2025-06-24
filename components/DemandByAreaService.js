import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

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
            console.error("Error fetching demand insights:", error); // this will catch and show the 500
          }
        }
    fetchInsights();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Demand by Area & Service</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#2563EB" />
      </BarChart>
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold">AI Insight</h3>
        <p>{insight}</p>
      </div>
    </div>
  );
}

export default DemandByAreaService;
