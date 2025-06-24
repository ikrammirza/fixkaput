import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce"; // run: npm install lodash.debounce

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (searchQuery = "", pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/stats/users", {
        params: { search: searchQuery, page: pageNumber, limit: 10 },
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users", err);
      setLoading(false);
    }
  };

  // Debounced search handler
  const handleSearchChange = debounce((value) => {
    setPage(1); // reset to page 1 when searching
    setSearch(value);
  }, 500);

  useEffect(() => {
    fetchUsers(search, page);
  }, [search, page]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">User List</h2>

      <input
        type="text"
        placeholder="Search users..."
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
                <th className="px-4 py-2 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-2">{user.name || "-"}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    <td className="px-4 py-2">{user.address || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No users found
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
