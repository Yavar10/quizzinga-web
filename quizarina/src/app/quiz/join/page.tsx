"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function JoinQuizPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("QZ-4821");
  const [name, setName] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode && name) {
      // Mock navigation to the quiz lobby
      router.push(`/quiz/${roomCode}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md">
        <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs mb-12">Quizzinga</p>
        
        <h1 className="editorial-heading text-5xl md:text-6xl mb-4">Enter The Arena.</h1>
        <p className="text-[var(--muted)] mb-12">Enter the room code to join the quiz.</p>

        <form onSubmit={handleJoin} className="space-y-6 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Room Code</label>
            <Input 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. QZ-4821" 
              className="text-center text-xl font-bold tracking-widest uppercase"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Your Name</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yavar" 
              className="text-center text-xl font-bold"
              required
            />
          </div>
          
          <Button type="submit" className="w-full py-4 text-lg mt-4">
            Join Quiz →
          </Button>
        </form>

        <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold mt-12">
          Powered by Quizzinga
        </p>
      </div>
    </div>
  );
}
