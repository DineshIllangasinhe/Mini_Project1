import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import TicketForm from "../components/TicketForm";
import Navbar from "../components/Navbar";

interface Ticket {
  id: number;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
}

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
];

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  /* FETCH TICKETS */
  const loadTickets = useCallback(async () => {
    setLoading(true);

    const res = await apiFetch(
      `/tickets?q=${q}&status=${status}&page=${page}&limit=${limit}`
    );

    setTickets(res.data);
    setTotal(res.total);
    setLoading(false);
  }, [q, status, page, limit]);

  /* DEBOUNCED SEARCH */
  useEffect(() => {
    const timer = setTimeout(loadTickets, 400);
    return () => clearTimeout(timer);
  }, [loadTickets]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
     
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-indigo-600">
              Helpdesk Tickets
            </h2>
          
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <label
                htmlFor="status"
                className="text-gray-500"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.label} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.label} value={s.value}>
                  {s.label}
                </option>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search tickets..."
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <TicketForm onCreated={loadTickets} />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6">
                      Loading tickets...
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{t.id}</td>
                      <td className="px-4 py-3 font-medium">
                        {t.title}
                      </td>
                      <td className="px-4 py-3">{t.priority}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${t.status === "OPEN"
                              ? "bg-yellow-100 text-yellow-700"
                              : t.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/tickets/${t.id}`}
                          className="text-indigo-600 font-medium hover:underline"
                        >
                          View 
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, total)} of {total}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-medium">
                Page {page} of {totalPages || 1}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );
}
