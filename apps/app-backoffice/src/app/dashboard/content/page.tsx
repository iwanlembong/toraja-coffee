"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

const checkAccess = async () => {
    const res = await axios.get(
        `${API_URL}/auth/me`,
        {
            withCredentials: true
        }
    );

    const role = res.data.role;

    if (
        role !== "SUPERADMIN" &&
        role !== "CONTENT_ADMIN"
    ) {
        window.location.href = "/dashboard";
    }
};


export default function ContentPage() {
  const [content, setContent] = useState<any>(null);

  const fetchContent = async () => {
    const res = await axios.get(
      `${API_URL}/content`
    );

    setContent(res.data);
  };

  useEffect(() => {
    checkAccess();
    fetchContent();
  }, []);

  const handleChange = (e: any) => {
    setContent({
      ...content,
      [e.target.name]: e.target.value
    });
  };

  const saveContent = async () => {
    await axios.put(
      `${API_URL}/content/${content.id}`,
      content
    );

    alert("Content updated");
  };

  if (!content) return <div>Loading...</div>;

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Content Management
      </h1>

      <div className="space-y-4 max-w-3xl">
        <input
          name="heroTitle"
          value={content.heroTitle}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="heroSubtitle"
          value={content.heroSubtitle}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="aboutToraja"
          value={content.aboutToraja}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows={5}
        />

        <textarea
          name="coffeeStory"
          value={content.coffeeStory}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows={5}
        />

        <button
          onClick={saveContent}
          className="bg-black text-white px-8 py-4 rounded"
        >
          Simpan
        </button>
      </div>
    </main>
  );
}