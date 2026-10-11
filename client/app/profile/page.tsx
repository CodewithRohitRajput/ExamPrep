"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/profile`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.profile);
        else setError(data.message || "Failed to load profile");
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!profile)
    return (
      <div>
        <p>{error}</p>
        <a href={`${API}/login/google`}>Login with Google</a>
      </div>
    );

  const user = profile.userId;

  return (
    <div>
      <Link href="/">Home</Link>
      <h1>My Profile</h1>

      {user?.profileImage && <img src={user.profileImage} alt={user.name} width={80} />}
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Subscription: {user?.subscriptionStatus}</p>

      <h2>Stats</h2>
      <p>Total Tests: {profile.totalTests}</p>
      <p>Passed: {profile.testsPassed}</p>
      <p>Failed: {profile.testsFailed}</p>
      <p>Total Questions: {profile.totalQuestions}</p>
      <p>Correct Answers: {profile.correctAnswers}</p>
      <p>Wrong Answers: {profile.wrongAnswers}</p>
      <p>Average Score: {profile.averageScore.toFixed(2)}%</p>
      <p>Best Score: {profile.bestScore.toFixed(2)}%</p>
    </div>
  );
}
