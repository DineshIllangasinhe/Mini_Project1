import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

interface Comment {
  id: number;
  comment: string;
  email: string;
}

export default function CommentBox({ ticketId }: { ticketId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  const loadComments = async () => {
    const res = await apiFetch(`/comments/${ticketId}`);
    setComments(res);
  };

  const addComment = async () => {
    await apiFetch(`/comments/${ticketId}`, {
      method: "POST",
      body: JSON.stringify({ comment: text })
    });
    setText("");
    loadComments();
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <div>
      <h3>Comments</h3>

      {comments.map(c => (
        <p key={c.id}>
          <b>{c.email}:</b> {c.comment}
        </p>
      ))}

      <input
        placeholder="Add comment"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={addComment}>Send</button>
    </div>
  );
}
