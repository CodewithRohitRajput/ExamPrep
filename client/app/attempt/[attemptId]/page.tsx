"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API = "http://localhost:8000";

export default function AttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/attempt/get/${attemptId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAttempt(data.attempt);
          setQuestions(data.questions);
        } else {
          setError(data.message || "Attempt not found");
        }
      })
      .catch(() => setError("Failed to load attempt"))
      .finally(() => setLoading(false));
  }, [attemptId]);

  const submit = async () => {
    setSubmitting(true);
    setError("");
    const body = {
      answers: Object.entries(selected).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })),
    };
    try {
      const res = await fetch(`${API}/attempt/submit/${attemptId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setAnswers(data.answers);
      } else {
        setError(data.message || "Submit failed");
      }
    } catch {
      setError("Submit failed");
    }
    setSubmitting(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!attempt) return <p>{error}</p>;

  const isCorrect = (questionId: string) =>
    answers.find((a) => a.questionId === questionId)?.isCorrect;

  return (
    <div>
      <Link href="/tests">Back to tests</Link>
      <h1>{attempt.testId?.title}</h1>
      <p>Duration: {attempt.testId?.durationMinutes} min</p>

      {result && (
        <div>
          <h2>Result</h2>
          <p>
            Score: {result.score} / {result.totalQuestions}
          </p>
          <p>Correct: {result.correctAnswers}</p>
          <p>Wrong: {result.wrongAnswers}</p>
          <p>Percentage: {result.percentage.toFixed(2)}%</p>
          <p>{result.passed ? "Passed" : "Failed"}</p>
          <Link href="/profile">View Profile</Link>
        </div>
      )}

      {questions.map((q, index) => (
        <div key={q._id}>
          <h3>
            {index + 1}. {q.question} ({q.difficulty})
          </h3>
          {["A", "B", "C", "D"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name={q._id}
                value={opt}
                checked={selected[q._id] === opt}
                disabled={!!result}
                onChange={() => setSelected({ ...selected, [q._id]: opt })}
              />
              {opt}. {q.options?.[opt]}
              <br />
            </label>
          ))}
          {result && (
            <p>
              {selected[q._id] === undefined
                ? "Not answered"
                : isCorrect(q._id)
                ? "Correct"
                : "Wrong"}
            </p>
          )}
        </div>
      ))}

      {error && <p>{error}</p>}

      {!result && (
        <button onClick={submit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
}
