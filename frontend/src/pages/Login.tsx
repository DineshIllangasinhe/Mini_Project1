import { useState } from "react";
import { apiFetch } from "../api/api";
import { jwtDecode } from "jwt-decode"


interface DecodedToken {
  id: number;
  role: "admin" | "user";
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (!res.accessToken) {
      alert("Invalid credentials");
      return;
    }

    const decoded = jwtDecode<DecodedToken>(res.accessToken);

    localStorage.setItem("token", res.accessToken);
    localStorage.setItem("role", decoded.role);

    if (decoded.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/tickets";
    }
  };

  return (

    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to Your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>

            <div className="mt-2">
              <input placeholder="Email" onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <button onClick={handleLogin} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Login</button> 
          </div>
           <p className="mt-10 text-center text-sm/6 text-gray-500">
            Don’t have an account? <a href="/register" className="font-semibold text-blue-600 hover:text-blue-500">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
