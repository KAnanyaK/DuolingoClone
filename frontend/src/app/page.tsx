"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  const { hearts, xp, streak, decrementHearts, refillHearts, addXp, incrementStreak } = useUserStore();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 flex flex-col items-center">
        {/* Unit Banner */}
        <div className="w-full bg-[#58CC02] rounded-2xl p-6 text-white mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="uppercase tracking-widest text-xs font-black opacity-85 mb-1">
              Unit 1
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">
              Basic German Greetings
            </h1>
            <p className="text-sm font-bold opacity-90">
              Say hello, introduce yourself, and order basic items
            </p>
          </div>
          <Button
            variant="default"
            size="md"
            className="self-start sm:self-auto text-[#58CC02] font-black"
          >
            Guidebook
          </Button>
        </div>

        {/* Interactive 3D Button Showcase & State Controller */}
        <section className="w-full bg-[#f7f7f7] border-2 border-[#e5e5e5] rounded-3xl p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-black text-[#4B4B4B] mb-2">
            Duolingo Signature 3D Buttons & Store Controls
          </h2>
          <p className="text-sm font-bold text-[#777777] mb-6">
            Click these 3D buttons to test physical press interactions and live state reactivity:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Button
              variant="primary"
              fullWidth
              onClick={() => addXp(10)}
            >
              +10 XP (#58CC02)
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => incrementStreak()}
            >
              Streak +1 (#1CB0F6)
            </Button>

            <Button
              variant="danger"
              fullWidth
              onClick={() => decrementHearts()}
            >
              Lose Heart (#FF4B4B)
            </Button>

            <Button
              variant="default"
              fullWidth
              onClick={() => refillHearts()}
            >
              Refill Hearts (5)
            </Button>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-[#e5e5e5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm font-extrabold text-[#4B4B4B]">
              <span>Current Hearts: <strong className="text-[#FF4B4B]">{hearts}</strong></span>
              <span>Current XP: <strong className="text-[#58CC02]">{xp}</strong></span>
              <span>Current Streak: <strong className="text-[#1CB0F6]">{streak}</strong></span>
            </div>
          </div>
        </section>

        {/* Learning Path Preview */}
        <section className="w-full flex flex-col items-center gap-10 py-6">
          <div className="text-center">
            <h3 className="text-lg font-black text-[#4B4B4B]">Start Learning</h3>
            <p className="text-xs font-bold text-[#777777]">Interactive skill path preview</p>
          </div>

          {/* Active Skill Node */}
          <div className="flex flex-col items-center group cursor-pointer">
            <a href="/lesson">
              <button className="w-24 h-24 rounded-full bg-[#58CC02] border-b-8 border-[#46a302] flex items-center justify-center text-white text-4xl shadow-md transition-all active:translate-y-2 active:border-b-0 cursor-pointer">
                ⭐
              </button>
            </a>
            <span className="mt-3 font-black text-sm text-[#4B4B4B] uppercase tracking-wider">
              Greetings
            </span>
          </div>

          {/* Locked Skill Nodes */}
          <div className="flex flex-col items-center opacity-60">
            <div className="w-20 h-20 rounded-full bg-[#e5e5e5] border-b-6 border-[#cecece] flex items-center justify-center text-gray-500 text-2xl">
              🔒
            </div>
            <span className="mt-2 font-black text-xs text-[#777777] uppercase tracking-wider">
              Basics 1
            </span>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
