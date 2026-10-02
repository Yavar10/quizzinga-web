"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const supabase = createClient();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Sign up successful! You can now log in.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Successful login, middleware will handle the rest, redirect to admin
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md card p-8 md:p-12">
        <div className="text-center mb-8">
          <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs mb-4">Quizzinga</p>
          <h1 className="editorial-heading text-3xl mb-2">Admin Access</h1>
          <p className="text-[var(--muted)] text-sm">
            {isSignUp ? "Create a new admin account" : "Log in to manage quizzes"}
          </p>
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 p-3 mb-6 text-center">
            <p className="text-red-400 text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@quizzinga.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button type="submit" className="w-full py-4 mt-4" disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-[var(--border)] pt-6">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
