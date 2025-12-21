import { isAdmin, logout } from "../utils/auth";
import { NavLink } from "react-router-dom";

export default function Navbar() {
 return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between">
      <h1 className="text-xl font-bold">Helpdesk Lite</h1>

      <div className="flex gap-4 items-center">
        <NavLink to="/tickets" className={({ isActive }) => isActive ? "text-gray-200 font-semibold" : "hover:text-gray-300"}>
          Tickets
        </NavLink>

        {/* ADMIN LINK (ONLY FOR ADMIN) */}
        {isAdmin() && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? "text-gray-200 font-semibold" : "hover:text-gray-300"}>
            Admin Dashboard
          </NavLink>
        )}

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
