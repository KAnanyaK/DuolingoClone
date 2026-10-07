"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DancingOwl } from "@/components/mascots/DancingOwl";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("demo_learner");
  const [password, setPassword] = useState("password123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/learn");
  };

  return (
    <div className="min-h-screen h-screen flex flex-col items-center justify-center bg-white dark:bg-[#131F24] px-4 font-nunito transition-colors duration-200 select-none">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center p-6 sm:p-8">
        {/* Giant Banner Text */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#58CC02] tracking-tight mb-6 text-center drop-shadow-xs">
          Welcome to Duolingo
        </h1>

        {/* Animated Duolingo Owl Mascot */}
        <div className="mb-6 scale-90 sm:scale-100 flex items-center justify-center">
          <DancingOwl />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mb-2 text-center">
          Log in
        </h1>
        <p className="text-sm font-bold text-[#777777] dark:text-[#93A4AC] mb-6 text-center">
          Continue your language learning journey
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Username / Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-black uppercase tracking-wider text-[#777777] dark:text-[#93A4AC] px-1"
            >
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white dark:bg-[#202F36] dark:border-[#37464F] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#1CB0F6] font-bold text-base transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-black uppercase tracking-wider text-[#777777] dark:text-[#93A4AC] px-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white dark:bg-[#202F36] dark:border-[#37464F] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#1CB0F6] font-bold text-base transition-all"
            />
          </div>

          {/* Full-width 3D Sky Blue LOG IN Button */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#1bb0f6e6] active:translate-y-1 active:border-b-0 font-black text-sm uppercase tracking-wider text-white transition-all cursor-pointer shadow-md select-none"
          >
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
}
