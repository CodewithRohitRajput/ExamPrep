"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUserId(data.userId);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Pro Quiz</h1>

      {userId ? (
        <p>Logged in as user: {userId}</p>
      ) : (
        <p>
          Not logged in. <a href={`${API}/login/google`}>Login with Google</a>
        </p>
      )}

      <ul>
        <li>
          <Link href="/tests">All Tests</Link>
        </li>
        <li>
          <Link href="/profile">My Profile</Link>
        </li>
      </ul>
    </div>
  );
}
