"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API = "http://localhost:8000";

export default function TestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch(`${API}/test/${testId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.test) setTest(data.test);
        else setError(data.message || "Test not found");
      })
      .catch(() => setError("Failed to load test"))
      .finally(() => setLoading(false));
  }, [testId]);

  const startAttempt = async () => {
    setStarting(true);
    setError("");
    try {
      const res = await fetch(`${API}/attempt/start/${testId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.attemptId) {
        router.push(`/attempt/${data.attemptId}`);
        return;
      }
      setError(data.message || "Could not start attempt");
    } catch {
      setError("Could not start attempt");
    }
    setStarting(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!test) return <p>{error}</p>;

  return (
    <div>
      <Link href="/tests">Back to tests</Link>
      <h1>{test.title}</h1>
      <p>{test.description}</p>
      <p>Topic: {test.topic}</p>
      <p>Total Questions: {test.totalQuestions}</p>
      <p>Duration: {test.durationMinutes} min</p>
      <p>{test.isFree ? "Free" : "Paid"}</p>

      {error && <p>{error}</p>}

      <button onClick={startAttempt} disabled={starting}>
        {starting ? "Starting..." : "Start Test"}
      </button>
    </div>
  );
}
