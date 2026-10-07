"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useUserStore } from "@/store/useUserStore";
import {
  Flame,
  Zap,
  Heart,
  Gem,
  ShieldCheck,
  Trophy,
  Users,
  UserPlus,
  Check,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SeededFriend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  xp: number;
  streak: number;
}

const SEEDED_FRIENDS: SeededFriend[] = [
  { id: "hans", name: "Hans", handle: "@hans_munich", avatar: "🐻", xp: 140, streak: 5 },
  { id: "clara", name: "Clara", handle: "@clara_berlin", avatar: "🦊", xp: 90, streak: 3 },
  { id: "lukas", name: "Lukas", handle: "@lukas_hamburg", avatar: "🦁", xp: 40, streak: 2 },
];

export default function ProfilePage() {
  const { xp, streak, hearts, gems } = useUserStore();

  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Initialize followed friends from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("duo_followed_friends");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFollowedIds(parsed);
            setFollowersCount(parsed.length);
          }
        }
      } catch (_) {}
    }
  }, []);

  const toggleFollow = (friendId: string) => {
    setFollowedIds((prev) => {
      const isCurrentlyFollowed = prev.includes(friendId);
      let next: string[];
      let nextCount: number;

      if (isCurrentlyFollowed) {
        next = prev.filter((id) => id !== friendId);
        nextCount = Math.max(0, followersCount - 1);
      } else {
        next = [...prev, friendId];
        nextCount = followersCount + 1;

        // If followers becomes = 3 immediately unlock the Friendly achievement with celebration animation
        if (nextCount === 3 || next.length === 3) {
          setShowCelebration(true);
          setJustUnlocked(true);
          setTimeout(() => {
            setShowCelebration(false);
          }, 4500);
        }
      }

      setFollowersCount(nextCount);
      if (typeof window !== "undefined") {
        localStorage.setItem("duo_followed_friends", JSON.stringify(next));
      }
      return next;
    });
  };

  const isFriendlyUnlocked = followersCount >= 3 || followedIds.length >= 3;

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8 font-nunito select-none">
        {/* Subtle Celebration Banner / Toast */}
        {showCelebration && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
            <div className="bg-white dark:bg-[#1A2C34] border-3 border-[#FFC800] rounded-3xl p-5 shadow-2xl flex items-center gap-4 relative overflow-hidden select-none ring-4 ring-[#FFC800]/25">
              {/* Iridescent top border accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFC800] via-[#FF9600] to-[#58CC02]" />

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFC800] to-[#FF9600] flex items-center justify-center text-3xl shadow-md flex-shrink-0 animate-bounce">
                🏆
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#FF9600] uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Achievement Unlocked!
                </div>
                <h4 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white leading-tight">
                  Friendly
                </h4>
                <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC]">
                  You followed 3 friends! Keep learning and growing together! 🎉
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2B3E48] hover:bg-gray-200 dark:hover:bg-[#37464F] flex items-center justify-center text-[#777777] dark:text-[#93A4AC] cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-3xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] shadow-sm">
          <div className="w-24 h-24 rounded-full bg-[#58CC02] flex items-center justify-center text-5xl shadow-md border-4 border-[#46a302]">
            🦉
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              Duo Learner
              <ShieldCheck className="w-6 h-6 text-[#1CB0F6]" />
            </h1>
            <p className="text-sm font-bold text-[#777777] dark:text-[#93A4AC] mb-3">
              @duo_learner • Joined Oct 2026
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#58CC02]/10 text-[#58CC02] font-black text-xs uppercase tracking-wider">
              German Learner 🇩🇪
            </div>
          </div>
        </div>

        {/* SECTION: FRIENDS (Above Statistics) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#4B4B4B] dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1CB0F6]" />
              Friends
            </h2>
            <button
              type="button"
              onClick={() => setIsFriendsModalOpen(true)}
              className="text-xs font-black uppercase tracking-wider text-[#1CB0F6] hover:text-[#1899D6] cursor-pointer"
            >
              View all ({SEEDED_FRIENDS.length})
            </button>
          </div>

          {/* Interactive Friends Card */}
          <div
            onClick={() => setIsFriendsModalOpen(true)}
            className="p-5 rounded-3xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] hover:border-[#1CB0F6] dark:hover:border-[#1CB0F6] cursor-pointer shadow-sm hover:shadow-md transition-all group select-none"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Overlapping Avatar Stack */}
                <div className="flex -space-x-3 items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#FFDE6A] border-2 border-white dark:border-[#1A2C34] flex items-center justify-center text-xl shadow-xs">
                    🐻
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FF9600] border-2 border-white dark:border-[#1A2C34] flex items-center justify-center text-xl shadow-xs">
                    🦊
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#1CB0F6] border-2 border-white dark:border-[#1A2C34] flex items-center justify-center text-xl shadow-xs">
                    🦁
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-[#4B4B4B] dark:text-white group-hover:text-[#1CB0F6] transition-colors">
                      {followersCount} {followersCount === 1 ? "Follower" : "Followers"}
                    </span>
                    <span className="text-[#AFAFAF] dark:text-[#58646D]">•</span>
                    <span className="font-extrabold text-sm text-[#777777] dark:text-[#93A4AC]">
                      {followedIds.length} Following
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] truncate">
                    {followedIds.length === 3
                      ? "You are following all 3 suggested friends! 🎉"
                      : "Hans, Clara, Lukas • Click to follow"}
                  </p>
                </div>
              </div>

              {/* Action pill button */}
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#1CB0F6]/10 text-[#1CB0F6] group-hover:bg-[#1CB0F6] group-hover:text-white font-black text-xs uppercase tracking-wider transition-all flex-shrink-0">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Find Friends</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: STATISTICS */}
        <div>
          <h2 className="text-xl font-black text-[#4B4B4B] dark:text-white mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-[#FF9600]/10 text-[#FF9600]">
                <Flame className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B] dark:text-white">{streak}</p>
                <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] uppercase tracking-wide">
                  Day Streak
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-[#FFC800]/10 text-[#FFC800]">
                <Zap className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B] dark:text-white">{xp}</p>
                <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] uppercase tracking-wide">
                  Total XP
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-[#1CB0F6]/10 text-[#1CB0F6]">
                <Gem className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B] dark:text-white">{gems}</p>
                <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] uppercase tracking-wide">
                  Gems
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B]">
                <Heart className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B] dark:text-white">{hearts}</p>
                <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] uppercase tracking-wide">
                  Hearts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: ALL ACHIEVEMENTS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-black text-[#4B4B4B] dark:text-white">
            All achievements
          </h2>

          <div className="rounded-3xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] overflow-hidden divide-y-2 divide-[#f2f2f2] dark:divide-[#263E4B] shadow-sm">
            {/* 1. Wildfire */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#FF4B4B] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center">
                  <Flame className="w-9 h-9 sm:w-10 sm:h-10 fill-[#FFC800] text-[#FFC800] drop-shadow-xs" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Wildfire
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    1/3
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "33%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Reach a 3 day streak
                </p>
              </div>
            </div>

            {/* 2. Sage */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#58CC02] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🧙‍♂️
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Sage
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    5/100
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "5%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Earn 100 XP
                </p>
              </div>
            </div>

            {/* 3. Champion */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#B86BFF] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🛡️
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Champion
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Unlock Leaderboards by completing 10 lessons
                </p>
              </div>
            </div>

            {/* 4. Sharpshooter */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#58CC02] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🏹
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Sharpshooter
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Complete 1 lesson with no mistakes
                </p>
              </div>
            </div>

            {/* 5. Winner */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#B86BFF] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center">
                  <Trophy className="w-9 h-9 sm:w-10 sm:h-10 fill-[#FFC800] text-[#FFC800] drop-shadow-xs" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Winner
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Finish #1 in the leaderboard
                </p>
              </div>
            </div>

            {/* 6. Friendly (Reactively updates with Follow count & celebration) */}
            <div
              className={`p-5 sm:p-6 flex items-center gap-4 sm:gap-6 transition-all duration-300 ${
                isFriendlyUnlocked ? "bg-[#58CC02]/5 dark:bg-[#58CC02]/10" : ""
              } ${justUnlocked ? "ring-2 ring-[#FFC800] rounded-2xl" : ""}`}
            >
              <div
                className={`w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl ${
                  isFriendlyUnlocked
                    ? "bg-gradient-to-br from-[#FFC800] to-[#FF9600] shadow-md shadow-[#FFC800]/30"
                    : "bg-[#B86BFF]"
                } p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0 transition-colors`}
              >
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🧑‍🤝‍🧑
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white ${
                    isFriendlyUnlocked ? "bg-black/30" : "bg-black/20"
                  } px-2 py-0.5 rounded-md whitespace-nowrap text-center`}
                >
                  {isFriendlyUnlocked ? "UNLOCKED 🏆" : "LEVEL 1"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white flex items-center gap-2">
                    Friendly
                    {isFriendlyUnlocked && (
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#58CC02] text-white">
                        COMPLETED
                      </span>
                    )}
                  </h3>
                  <span
                    className={`font-extrabold text-xs sm:text-sm ${
                      isFriendlyUnlocked
                        ? "text-[#58CC02] font-black"
                        : "text-[#AFAFAF] dark:text-[#8898A1]"
                    }`}
                  >
                    {Math.min(followersCount, 3)}/3
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFriendlyUnlocked ? "bg-[#58CC02]" : "bg-[#FFC800]"
                    }`}
                    style={{ width: `${(Math.min(followersCount, 3) / 3) * 100}%` }}
                  />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Follow 3 friends
                </p>
              </div>
            </div>

            {/* 7. Weekend Warrior */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#58CC02] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🪖
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Weekend Warrior
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/2
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Complete a lesson on Saturday and Sunday
                </p>
              </div>
            </div>

            {/* 8. Photogenic */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#1CB0F6] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🖼️
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Photogenic
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Add a profile picture
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Overlay: Seeded Friends List Modal */}
      {isFriendsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none font-nunito"
          onClick={() => setIsFriendsModalOpen(false)}
        >
          <div
            className="max-w-md w-full bg-white dark:bg-[#1A2C34] rounded-3xl p-6 border-2 border-[#e5e5e5] dark:border-[#263E4B] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#f2f2f2] dark:border-[#263E4B] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1CB0F6]/10 text-[#1CB0F6] flex items-center justify-center">
                  <Users className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#4B4B4B] dark:text-white leading-tight">
                    Friends
                  </h3>
                  <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC]">
                    {followersCount} {followersCount === 1 ? "follower" : "followers"} • {followedIds.length} following
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFriendsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2B3E48] hover:bg-gray-200 dark:hover:bg-[#37464F] flex items-center justify-center text-[#777777] dark:text-[#93A4AC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Friends List */}
            <div className="flex flex-col divide-y-2 divide-[#f2f2f2] dark:divide-[#263E4B]">
              {SEEDED_FRIENDS.map((friend) => {
                const isFollowed = followedIds.includes(friend.id);
                return (
                  <div key={friend.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#202F36] border-2 border-[#e5e5e5] dark:border-[#263E4B] flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                        {friend.avatar}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-sm sm:text-base text-[#4B4B4B] dark:text-white truncate">
                          {friend.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#777777] dark:text-[#93A4AC]">
                          <span className="text-[#FFC800] flex items-center gap-0.5">
                            <Zap className="w-3 h-3 fill-current" /> {friend.xp} XP
                          </span>
                          <span>•</span>
                          <span className="text-[#FF9600] flex items-center gap-0.5">
                            <Flame className="w-3 h-3 fill-current" /> {friend.streak}d streak
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Follow / Following Interactive Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleFollow(friend.id)}
                      className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 flex-shrink-0 ${
                        isFollowed
                          ? "bg-gray-100 dark:bg-[#2B3E48] text-[#777777] dark:text-[#93A4AC] border-2 border-[#e5e5e5] dark:border-[#37464F] hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          : "bg-[#1CB0F6] border-b-3 border-[#1899D6] hover:bg-[#1899D6] active:border-b-0 text-white shadow-xs"
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#58CC02] stroke-[3]" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Status */}
            <div className="mt-4 pt-3.5 border-t-2 border-[#f2f2f2] dark:border-[#263E4B] flex items-center justify-between text-xs font-bold text-[#777777] dark:text-[#93A4AC]">
              <span>Follow 3 friends to unlock Friendly achievement</span>
              <span className={`font-black ${isFriendlyUnlocked ? "text-[#58CC02]" : "text-[#1CB0F6]"}`}>
                {Math.min(followersCount, 3)}/3
              </span>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
