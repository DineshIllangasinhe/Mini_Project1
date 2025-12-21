import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

interface User {
  id: number;
  email: string;
}

export default function AdminAssign({ ticketId }: { ticketId: number }) {
  const [users, setUsers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState<number | "">("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "admin") {
      apiFetch("/auth/users").then(setUsers);
    }
  }, []);

  const assignTicket = async () => {
    if (!assignedTo) return alert("Select a user");

    await apiFetch(`/tickets/${ticketId}/assign`, {
      method: "PUT",
      body: JSON.stringify({ assigned_to: assignedTo })
    });

    alert("Ticket assigned successfully");
  };

  if (role !== "admin") return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Assign Ticket (Admin)</h3>

      <select
        value={assignedTo}
        onChange={e => setAssignedTo(Number(e.target.value))}
      >
        <option value="">Select user</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
      </select>

      <button onClick={assignTicket}>Assign</button>
    </div>
  );
}
