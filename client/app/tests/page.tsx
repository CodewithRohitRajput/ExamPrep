"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

export default function TestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/test/alltests`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTests(data.tests);
        else setError(data.message || "Failed to load tests");
      })
      .catch(() => setError("Failed to load tests"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Link href="/">Home</Link>
      <h1>All Tests</h1>

      {tests.length === 0 && <p>No tests available.</p>}

      <ul>
        {tests.map((test) => (
          <li key={test._id}>
            <Link href={`/tests/${test._id}`}>{test.title}</Link>
            <p>{test.description}</p>
            <p>
              Topic: {test.topic} | Questions: {test.totalQuestions} | Duration:{" "}
              {test.durationMinutes} min | {test.isFree ? "Free" : "Paid"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
