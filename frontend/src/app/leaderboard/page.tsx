"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { API_BASE_URL } from "@/config/api";
import { Flame, Zap, Trophy, Medal, Shield, ChevronUp } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { LeaderboardHeroGraphic } from "@/components/leaderboard/LeaderboardHeroGraphic";

interface LeaderboardUser {
  id: number;
  username: string;
  xp: number;
  streak: number;
  avatar: string;
  rank: number;
  is_current_user: boolean;
}

type LeagueTier = "below_bronze" | "bronze" | "silver" | "gold";

export default function LeaderboardPage() {
  const { xp: currentUserXp } = useUserStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard`)
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

  // Determine current user rank and league progression
  const currentUser = leaderboard.find((u) => u.is_current_user);
  const userRank = currentUser ? currentUser.rank : 3;

  // Tier determination:
  // - userRank === 1: Gold League
  // - userRank === 2: Silver League
  // - userRank === 3: Bronze League (inside top 3)
  // - userRank > 3: Below Bronze (outside top 3 promotion zone)
  const currentTier: LeagueTier =
    userRank === 1
      ? "gold"
      : userRank === 2
      ? "silver"
      : userRank === 3
      ? "bronze"
      : "below_bronze";

  const tierConfig = {
    below_bronze: {
      title: "Starter League",
      description: "Complete lessons to earn +10 XP and advance to the Bronze League!",
      badgeBg: "bg-gradient-to-b from-[#58CC02] to-[#46A302] border-b-6 border-[#388E00] shadow-md",
      badgeIcon: <Shield className="w-10 h-10 stroke-[2.5] text-white" />,
      tag: "Advance to Bronze",
      tagColor: "bg-[#58CC02]/15 dark:bg-[#58CC02]/25 text-[#58CC02] dark:text-[#76db2e]",
    },
    bronze: {
      title: "Bronze League",
      description: "Complete lessons to earn +10 XP and advance to the Silver League!",
      badgeBg: "bg-gradient-to-b from-[#E07F00] to-[#B85C00] border-b-6 border-[#8C4600] shadow-md",
      badgeIcon: <Trophy className="w-10 h-10 stroke-[2.5] text-white" />,
      tag: "Bronze Tier",
      tagColor: "bg-[#E07F00]/15 dark:bg-[#E07F00]/25 text-[#B85C00] dark:text-[#FFA742]",
    },
    silver: {
      title: "Silver League",
      description: "You're in the Silver League! Complete lessons to earn +10 XP and advance to the Gold League!",
      badgeBg: "bg-gradient-to-b from-[#C4C4C4] to-[#9E9E9E] border-b-6 border-[#757575] shadow-md",
      badgeIcon: <Medal className="w-10 h-10 stroke-[2.5] text-white" />,
      tag: "Silver Tier",
      tagColor: "bg-gray-200 dark:bg-[#2A3B43] text-[#555555] dark:text-[#E0E0E0]",
    },
    gold: {
      title: "Gold League",
      description: "Congratulations on reaching the Gold League! 🏆 You're at the top of the leaderboard — keep playing to defend your #1 spot and stay a champion!",
      badgeBg: "bg-gradient-to-b from-[#FFD900] to-[#FFB800] border-b-6 border-[#E5A800] shadow-[0_4px_20px_rgba(255,200,0,0.45)]",
      badgeIcon: <Trophy className="w-10 h-10 stroke-[2.5] text-white filter drop-shadow-sm" />,
      tag: "Top Tier Champion 👑",
      tagColor: "bg-[#FFC800]/20 dark:bg-[#FFC800]/25 text-[#D97706] dark:text-[#FFD900]",
    },
  }[currentTier];

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFC800] text-white flex items-center justify-center font-black text-sm shadow-xs">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#AFAFAF] text-white flex items-center justify-center font-black text-sm shadow-xs">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#E07F00] text-white flex items-center justify-center font-black text-sm shadow-xs">
          3
        </div>
      );
    }
    return (
      <span className="w-8 text-center font-black text-[#AFAFAF] dark:text-[#8898A1] text-sm">
        {rank}
      </span>
    );
  };

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 font-nunito">
        {/* Dynamic Leaderboard Header Banner */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Custom 3-Badge Illustration Hero Graphic */}
          <div className="mb-2 select-none hover:scale-105 transition-transform duration-300">
            <LeaderboardHeroGraphic className="w-48 sm:w-56 h-auto drop-shadow-md" />
          </div>

          {/* League Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mb-2 tracking-tight">
            {tierConfig.title}
          </h1>

          {/* Status Tag Pill */}
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2.5 ${tierConfig.tagColor}`}
          >
            {tierConfig.tag}
          </div>

          {/* Dynamic Motivational / Congratulatory Message */}
          <p className="text-sm sm:text-base font-bold text-[#777777] dark:text-[#93A4AC] max-w-lg leading-relaxed">
            {tierConfig.description}
          </p>
        </div>

        {/* Leaderboard Table Container */}
        <div className="bg-white dark:bg-[#1A2C34] border-2 border-[#E5E5E5] dark:border-[#263E4B] rounded-3xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                Loading leaderboard...
              </p>
            </div>
          ) : (
            <div className="divide-y-2 divide-[#F2F2F2] dark:divide-[#263E4B]">
              {leaderboard.map((user, index) => {
                // The promotion zone line is strictly fixed below the top 3 (after index 2)
                const isAfterTop3 = index === 2 && index < leaderboard.length - 1;

                return (
                  <React.Fragment key={user.id}>
                    <div
                      className={`flex items-center justify-between px-6 py-4 transition-colors ${
                        user.is_current_user
                          ? "bg-[#ddf4ff] dark:bg-[#1B3644] border-y-2 border-[#84d8ff] dark:border-[#216584]"
                          : "hover:bg-gray-50 dark:hover:bg-[#202F36]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getRankBadge(user.rank)}
                        <span className="text-2xl leading-none select-none">
                          {user.avatar}
                        </span>
                        <div>
                          <div
                            className={`text-base font-extrabold ${
                              user.is_current_user
                                ? "text-[#1CB0F6] dark:text-[#49c0f8]"
                                : "text-[#4B4B4B] dark:text-white"
                            }`}
                          >
                            {user.username}{" "}
                            {user.is_current_user && (
                              <span className="text-xs font-black uppercase tracking-wider ml-1 text-[#1CB0F6] dark:text-[#49c0f8]">
                                (You)
                              </span>
                            )}
                          </div>
                          <div
                            className={`flex items-center gap-1 text-xs font-bold ${
                              user.is_current_user
                                ? "text-[#777777] dark:text-[#93A4AC]"
                                : "text-[#AFAFAF] dark:text-[#8898A1]"
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5 fill-[#FF9600] text-[#FF9600] stroke-none" />
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

                    {/* Fixed Promotion Zone Divider immediately below Top 3 */}
                    {isAfterTop3 && (
                      <div className="bg-[#E5F9DB] dark:bg-[#1B3624] px-6 py-2 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#58CC02] border-y border-[#c3f0b4] dark:border-[#274f35]">
                        <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Promotion Zone</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
