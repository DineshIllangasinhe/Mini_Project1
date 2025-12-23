import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";
import { isAdmin } from "../utils/auth";
import { Link } from "react-router-dom";

interface Ticket {
  id: number;
  title: string;
  status: string;
  priority: string;
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      alert("Access denied: Admins only");
      window.location.href = "/tickets";
      return;
    }

    const loadTickets = async () => {
      try {
        const res = await apiFetch("/tickets");
        setTickets(res.data || res);
      } catch (err) {
        console.error("Failed to load tickets:", err);
        alert("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            Admin Dashboard
          </h2>

          {loading && (
            <p className="text-gray-500 text-center">Loading tickets...</p>
          )}

          {!loading && tickets.length === 0 && (
            <p className="text-gray-500 text-center">
              No tickets found
            </p>
          )}

          {!loading && tickets.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">
                      {ticket.title}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${
                            ticket.status === "OPEN"
                              ? "bg-red-100 text-red-700"
                              : ticket.status === "IN_PROGRESS"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${
                            ticket.priority === "HIGH"
                              ? "bg-red-200 text-red-800"
                              : ticket.priority === "MEDIUM"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-green-200 text-green-800"
                          }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
