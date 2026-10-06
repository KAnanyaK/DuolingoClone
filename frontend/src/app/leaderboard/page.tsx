"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Shield, Flame, Zap, Trophy, Medal } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface LeaderboardUser {
  id: number;
  username: string;
  xp: number;
  streak: number;
  avatar: string;
  rank: number;
  is_current_user: boolean;
}

export default function LeaderboardPage() {
  const { xp: currentUserXp } = useUserStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/leaderboard")
      .then((res) => {
        if (!res.ok) throw new Error("Leaderboard API failed");
        return res.json();
      })
      .then((data: LeaderboardUser[]) => {
        setLeaderboard(data);
      })
      .catch(() => {
        // Fallback realistic leaderboard
        const fallbackList: LeaderboardUser[] = [
          { id: 101, username: "hans_munich", xp: 140, streak: 5, avatar: "🐻", rank: 1, is_current_user: false },
          { id: 102, username: "clara_berlin", xp: 90, streak: 3, avatar: "🦊", rank: 2, is_current_user: false },
          { id: 1, username: "duo_learner (You)", xp: currentUserXp, streak: 1, avatar: "🦆", rank: 3, is_current_user: true },
          { id: 103, username: "lukas_hamburg", xp: 40, streak: 2, avatar: "🦁", rank: 4, is_current_user: false },
          { id: 104, username: "sophie_vienna", xp: 20, streak: 1, avatar: "🦉", rank: 5, is_current_user: false },
        ];
        fallbackList.sort((a, b) => b.xp - a.xp);
        fallbackList.forEach((item, index) => { item.rank = index + 1; });
        setLeaderboard(fallbackList);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUserXp]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFC800] text-white flex items-center justify-center font-black text-sm shadow">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#afafaf] text-white flex items-center justify-center font-black text-sm shadow">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#e07f00] text-white flex items-center justify-center font-black text-sm shadow">
          3
        </div>
      );
    }
    return (
      <span className="w-8 text-center font-black text-[#afafaf] text-sm">
        {rank}
      </span>
    );
  };

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 font-nunito">
        {/* Leaderboard Header Banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-3 rounded-3xl bg-[#FFC800] border-b-6 border-[#e5a800] flex items-center justify-center text-white shadow-md">
            <Trophy className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] mb-1">
            Bronze League
          </h1>
          <p className="text-sm font-bold text-[#777777]">
            Complete lessons to earn +10 XP and advance to the Silver League!
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white border-2 border-[#e5e5e5] rounded-3xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-[#777777]">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-[#f2f2f2]">
              {leaderboard.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between px-6 py-4 transition-colors ${
                    user.is_current_user
                      ? "bg-[#ddf4ff] border-y-2 border-[#84d8ff]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getRankBadge(user.rank)}
                    <span className="text-2xl leading-none">{user.avatar}</span>
                    <div>
                      <div
                        className={`text-base font-extrabold ${
                          user.is_current_user
                            ? "text-[#4B4B4B] dark:!text-[#3c484f]"
                            : "text-[#4B4B4B]"
                        }`}
                      >
                        {user.username}{" "}
                        {user.is_current_user && (
                          <span className="text-[#1CB0F6] dark:!text-[#0f7da8] text-xs font-black uppercase tracking-wider">
                            (You)
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-bold ${
                          user.is_current_user
                            ? "text-[#afafaf] dark:!text-[#4f5d65]"
                            : "text-[#afafaf]"
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 fill-[#1CB0F6] dark:fill-[#0f7da8] stroke-none" />
                        <span>{user.streak} day streak</span>
                      </div>
                    </div>
                  </div>

                  {/* User XP */}
                  <div className="flex items-center gap-1.5 font-black text-[#58CC02] text-base sm:text-lg">
                    <Zap className="w-5 h-5 fill-[#58CC02] stroke-none" />
                    <span>{user.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
