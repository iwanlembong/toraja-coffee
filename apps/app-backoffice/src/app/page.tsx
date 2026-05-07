"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth =
      async () => {
        try {
          await axios.get(
            `${API_URL}/auth/me`,
            {
              withCredentials: true
            }
          );

          router.push(
            "/dashboard"
          );
        } catch {
          router.push(
            "/login"
          );
        }
      };

    checkAuth();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}