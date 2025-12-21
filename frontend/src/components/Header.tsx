export default function Header() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
