"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      console.log("start login");

      const res = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("login success", res.data);

      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4"
      >
        <input
          className="w-full border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="w-full border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-3"
        >
          Login
        </button>
      </form>
    </div>
  );
}