"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Login failed");
      }
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm">
      <div className="login-wrap">
        <form className="login-card" onSubmit={submit}>
          <div className="eyebrow">Raees &amp; Aysha</div>
          <h1>Wedding Analytics</h1>
          <p>Admin sign in</p>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div className="login-err">{err}</div>
        </form>
      </div>
    </div>
  );
}
