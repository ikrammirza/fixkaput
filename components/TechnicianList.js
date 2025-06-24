import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce"; // run: npm install lodash.debounce

export default function TechnicianList() {
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTechnicians = async (searchQuery = "", pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/stats/technicians", {
        params: { search: searchQuery, page: pageNumber, limit: 10 },
      });
      setTechnicians(res.data.technicians);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching technicians", err);
      setLoading(false);
    }
  };

  // Debounced search handler
  const handleSearchChange = debounce((value) => {
    setPage(1); // reset to page 1 when searching
    setSearch(value);
  }, 500);

  useEffect(() => {
    fetchTechnicians(search, page);
  }, [search, page]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Technician List</h2>

      <input
        type="text"
        placeholder="Search technicians..."
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full"
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Aadhar No.</th>
                <th className="px-4 py-2 text-left">Accepted Orders</th>
                <th className="px-4 py-2 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {technicians.length > 0 ? (
                technicians.map((technician) => (
                  <tr key={technician._id} className="border-b">
                    <td className="px-4 py-2">{technician.name || "-"}</td>
                    <td className="px-4 py-2">{technician.phone}</td>
                    <td className="px-4 py-2">{technician.aadhar}</td>
                    <td className="px-4 py-2">
          {technician.acceptedOrderCount}
        </td>
                    <td className="px-4 py-2">{technician.address || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No technicians found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
