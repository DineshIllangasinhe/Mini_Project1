import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import CommentBox from "../components/CommentBox";
import Navbar from "../components/Navbar";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: number | null;
}

export default function TicketDetails() {
  const id = window.location.pathname.split("/").pop();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTicket = async () => {
    try {
      const data = await apiFetch(`/tickets/${id}`);
      setTicket(data);
      setStatus(data.status);
    } catch {
      alert("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    try {
      await apiFetch(`/tickets/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      alert("Status updated");
      loadTicket();
    } catch {
      alert("Failed to update status");
    }
  };

  const assignTicket = async () => {
    if (!assignedTo) {
      alert("Enter user ID");
      return;
    }

    try {
      await apiFetch(`/tickets/${id}/assign`, {
        method: "PUT",
        body: JSON.stringify({ assigned_to: Number(assignedTo) })
      });
      alert("Ticket assigned");
      loadTicket();
    } catch {
      alert("Assignment failed (Admin only)");
    }
  };

  useEffect(() => {
    loadTicket();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center text-red-500 mt-10">
        Ticket not found
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {ticket.title}
          </h2>
          <p className="text-gray-500 mt-2">{ticket.description}</p>
        </div>

        {/* META INFO */}
        <div className="flex flex-wrap gap-4">
          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
            Priority: {ticket.priority}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              ticket.status === "OPEN"
                ? "bg-yellow-100 text-yellow-700"
                : ticket.status === "IN_PROGRESS"
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            Status: {ticket.status}
          </span>
        </div>

        {/* STATUS UPDATE */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Update Status
          </h3>
          <div className="flex gap-3 items-center">
            <select
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
            <button
              onClick={updateStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Update
            </button>
          </div>
        </div>

        {/* ADMIN ASSIGN */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Assign Ticket (Admin)
          </h3>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              placeholder="User ID"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="border rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring focus:ring-purple-300"
            />
            <button
              onClick={assignTicket}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              Assign
            </button>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            Comments
          </h3>
          <CommentBox ticketId={id!} />
        </div>

      </div>
    </div>
    </>
  );
}
