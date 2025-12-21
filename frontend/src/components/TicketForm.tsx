import { useState } from "react";
import { apiFetch } from "../api/api";

export default function TicketForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");

  const createTicket = async () => {
    await apiFetch("/tickets", {
      method: "POST",
      body: JSON.stringify({ title, description, priority })
    });

    setTitle("");
    setDescription("");
    onCreated();
  };

  return (
    <div>
      <h3>Create Ticket</h3>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <textarea
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />
      <select onChange={e => setPriority(e.target.value)}>
        <option>LOW</option>
        <option>MEDIUM</option>
        <option>HIGH</option>
      </select>
      <button onClick={createTicket}>Create</button>
    </div>
  );
}
