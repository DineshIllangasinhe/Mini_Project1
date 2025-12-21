import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import TicketForm from "../components/TicketForm";
import Navbar from "../components/Navbar";

interface Ticket {
  id: number;
  title: string;
  status: string;
  priority: string;
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const loadTickets = useCallback(async () => {
    const res = await apiFetch(`/tickets?q=${q}&page=${page}&limit=5`);
    setTickets(res.data);
  }, [q, page]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        {/* HEADER */}
        <div className="max-w-5xl mx-auto mb-6">
          <h2 className="text-3xl font-bold text-indigo-600">
            Helpdesk Tickets
          </h2>
        </div>

        {/* MAIN CARD */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
          {/* SEARCH */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tickets..."
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* CREATE TICKET */}
          <div className="mb-6">
            <TicketForm onCreated={loadTickets} />
          </div>

          {/* TICKETS LIST */}
          <ul className="space-y-4">
            {tickets.map((t) => (
              <li
                key={t.id}
                className="border rounded-lg p-4 hover:shadow transition flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Priority: {t.priority}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      t.status === "OPEN"
                        ? "bg-yellow-100 text-yellow-700"
                        : t.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {t.status}
                  </span>

                  <a
                    href={`/tickets/${t.id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    View →
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {/* PAGINATION */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Prev
            </button>

            <span className="text-gray-600 font-medium">Page {page}</span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
