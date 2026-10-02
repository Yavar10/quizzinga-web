"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [platformVisible, setPlatformVisible] = useState(true);
  const [comingSoon, setComingSoon] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Mock save functionality since there is no settings table yet
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-8 md:p-12 max-w-4xl w-full mx-auto flex-1 flex flex-col">
      <header className="mb-12">
        <h1 className="editorial-heading text-4xl md:text-5xl mb-2">Platform Settings</h1>
        <p className="text-[var(--muted)] text-lg">Configure global flags and platform visibility.</p>
      </header>

      {saved && (
        <div className="card border-[#00ff88]/30 bg-[#00ff88]/5 mb-8">
          <p className="text-[#00ff88] text-sm">Settings saved successfully.</p>
        </div>
      )}

      <section className="space-y-6">
        <div className="card border-[var(--border)]">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-[var(--border)] pb-4">
            Visibility Flags
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg mb-1">Platform Visible</p>
                <p className="text-[var(--muted)] text-sm">When disabled, the public library will be hidden from users.</p>
              </div>
              <button 
                onClick={() => setPlatformVisible(!platformVisible)}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                  platformVisible ? 'bg-[#00ff88]' : 'bg-[var(--border)]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  platformVisible ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg mb-1">"Coming Soon" Mode</p>
                <p className="text-[var(--muted)] text-sm">When enabled, users will see a coming soon page instead of quizzes.</p>
              </div>
              <button 
                onClick={() => setComingSoon(!comingSoon)}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                  comingSoon ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  comingSoon ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="card border-[var(--border)]">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-[var(--border)] pb-4">
            AI Configuration
          </h2>
          <div className="space-y-4">
            <p className="text-[var(--muted)] text-sm mb-4">
              AI answer evaluation is active and using Gemini 3.8 Flash. No configuration required.
            </p>
            <Button variant="secondary" disabled>Test API Connection (Coming Soon)</Button>
          </div>
        </div>

        <div className="pt-6">
          <Button onClick={handleSave} className="px-12 py-6 text-lg">Save Changes</Button>
        </div>
      </section>
    </div>
  );
}
