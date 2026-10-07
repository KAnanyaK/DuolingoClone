"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkillNode, SkillStatus } from "@/components/path/SkillNode";
import { Button } from "@/components/ui/Button";
import { BookOpen, Lock } from "lucide-react";
import { DancingOwl } from "@/components/mascots/DancingOwl";
import { EatingPanda } from "@/components/mascots/EatingPanda";
import { PainterMascot } from "@/components/mascots/PainterMascot";
import { SuperSidebarCard } from "@/components/ui/SuperSidebarCard";
import { SuperModal } from "@/components/ui/SuperModal";
import { DailyGoalWidget } from "@/components/ui/DailyGoalWidget";

interface SkillItem {
  id: number;
  name: string;
  status: SkillStatus;
  progress: number;
  total_lessons: number;
  icon: string;
  mid_progress?: number;
}

interface UnitItem {
  id: number;
  title: string;
  description: string;
  order: number;
  skills: SkillItem[];
}

interface PathData {
  course_id: number;
  course_title: string;
  units: UnitItem[];
}

export default function LearnPage() {
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientMidProgress, setClientMidProgress] = useState<Record<number, number>>({});
  const [isSuperModalOpen, setIsSuperModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored: Record<number, number> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("duo_skill_progress_")) {
          const skillId = parseInt(key.replace("duo_skill_progress_", ""), 10);
          const val = parseFloat(localStorage.getItem(key) || "0");
          if (!isNaN(skillId) && !isNaN(val)) {
            stored[skillId] = val;
          }
        }
      }
      setClientMidProgress(stored);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/courses/1/path", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch path data");
        return res.json();
      })
      .then((data: PathData) => {
        setPathData(data);
        if (typeof window !== "undefined") {
          data.units.forEach((u) => {
            u.skills.forEach((s) => {
              if (s.status === "active" && s.progress === 0 && (!s.mid_progress || s.mid_progress === 0)) {
                localStorage.removeItem(`duo_skill_progress_${s.id}`);
                localStorage.removeItem(`duo_skill_exercise_idx_${s.id}`);
                setClientMidProgress((prev) => {
                  const copy = { ...prev };
                  delete copy[s.id];
                  return copy;
                });
              }
            });
          });
        }
      })
      .catch(() => {
        // Fallback Section 1 with 3 units
        setPathData({
          course_id: 1,
          course_title: "German",
          units: [
            {
              id: 1,
              title: "Unit 1: Greetings & Basics",
              description: "Say hello, introduce yourself, and master daily essentials",
              order: 1,
              skills: [
                { id: 1, name: "Greetings", status: "completed", progress: 4, total_lessons: 4, icon: "star" },
                { id: 2, name: "Basics 1", status: "active", progress: 0, total_lessons: 4, icon: "book" },
                { id: 3, name: "Phrases", status: "locked", progress: 0, total_lessons: 4, icon: "message" },
              ],
            },
            {
              id: 2,
              title: "Unit 2: Family & Friends",
              description: "Talk about family members, relationships, and friends",
              order: 2,
              skills: [
                { id: 4, name: "Family", status: "locked", progress: 0, total_lessons: 4, icon: "star" },
                { id: 5, name: "Home", status: "locked", progress: 0, total_lessons: 4, icon: "book" },
                { id: 6, name: "Friends", status: "locked", progress: 0, total_lessons: 4, icon: "message" },
              ],
            },
            {
              id: 3,
              title: "Unit 3: Colors & Numbers",
              description: "Count numbers and describe things with vibrant colors",
              order: 3,
              skills: [
                { id: 7, name: "Numbers", status: "locked", progress: 0, total_lessons: 4, icon: "star" },
                { id: 8, name: "Colors", status: "locked", progress: 0, total_lessons: 4, icon: "book" },
                { id: 9, name: "Shopping", status: "locked", progress: 0, total_lessons: 4, icon: "utensils" },
              ],
            },
          ],
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Zigzag offsets for a "V rotated 90 degrees anticlockwise" (< shape):
  // Node 0: Center / Right-aligned start (e.g. +translate-x-12)
  // Node 1: Leftmost apex/vertex (-translate-x-20)
  // Node 2: Center / Right-aligned end (e.g. +translate-x-12)
  const zigzagOffsets = [
    "translate-x-12 sm:translate-x-16",
    "-translate-x-12 sm:-translate-x-16",
    "translate-x-12 sm:translate-x-16",
  ];

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-nunito select-none flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Main Learning Path Column */}
        <div className="flex-1 max-w-2xl w-full flex flex-col items-center">
          {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
            <p className="font-extrabold text-[#777777]">Loading learning path...</p>
          </div>
        ) : (
          <>
            {pathData?.units.map((unit) => {
              // Check if all skills in this unit are locked
              const isUnitLocked = unit.skills.every((s) => s.status === "locked");

              // Determine unit theme color: Unit 1 Green (#58CC02), Unit 2 Blue (#1CB0F6), Unit 3 Red (#FF4B4B)
              const unitColorConfig =
                unit.order === 2
                  ? {
                      bgClass: "bg-[#1CB0F6]",
                      textColor: "text-[#1CB0F6]",
                      buttonBorder: "border-[#1899D6]",
                    }
                  : unit.order === 3
                  ? {
                      bgClass: "bg-[#FF4B4B]",
                      textColor: "text-[#FF4B4B]",
                      buttonBorder: "border-[#ea2b2b]",
                    }
                  : {
                      bgClass: "bg-[#58CC02]",
                      textColor: "text-[#58CC02]",
                      buttonBorder: "border-[#46a302]",
                    };

              return (
                <div key={unit.id} className="w-full flex flex-col items-center mb-16">
                  {/* Unit Header Banner: Unit 1 Green, Unit 2 Blue, Unit 3 Red */}
                  <div
                    className={`w-full ${unitColorConfig.bgClass} rounded-3xl p-6 text-white mb-12 shadow-sm flex items-center justify-between`}
                  >
                    <div>
                      <div className="uppercase tracking-widest text-xs font-black opacity-85 mb-1 flex items-center gap-1.5">
                        {isUnitLocked && <Lock className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>Unit {unit.order}</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black mb-1">
                        {unit.title}
                      </h1>
                      <p className="text-xs sm:text-sm font-semibold opacity-95">
                        {unit.description}
                      </p>
                    </div>
                    {!isUnitLocked && (
                      <Link
                        href={`/guidebook/${unit.order}`}
                        className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl ${unitColorConfig.textColor} font-black text-sm border-2 border-white/60 bg-white hover:bg-gray-50 active:translate-y-0.5 shadow-sm transition-all cursor-pointer select-none`}
                      >
                        <BookOpen className="w-4 h-4 mr-0.5" /> Guidebook
                      </Link>
                    )}
                  </div>

                  {/* Zigzag Path Column with Relative Positioning for Mascots */}
                  <div className="relative flex flex-col items-center gap-10 sm:gap-14 py-4 w-full">
                    {/* Unit 1 Mascot: Dancing Duo Owl on the right side */}
                    {unit.order === 1 && (
                      <div className="absolute right-2 sm:right-4 md:right-12 top-[30%] -translate-y-1/2 z-0 scale-75 sm:scale-90 md:scale-100 pointer-events-none transition-transform">
                        <DancingOwl />
                      </div>
                    )}

                    {/* Unit 2 Mascot: Eating Panda on the left side (Always fully colored even if unit is locked) */}
                    {unit.order === 2 && (
                      <div className="absolute left-2 sm:left-4 md:left-12 top-[50%] -translate-y-1/2 z-0 scale-75 sm:scale-90 md:scale-100 pointer-events-none transition-transform">
                        <EatingPanda />
                      </div>
                    )}

                    {/* Unit 3 Mascot: Painter Mascot on the right side */}
                    {unit.order === 3 && (
                      <div className="absolute right-2 sm:right-4 md:right-12 top-[40%] -translate-y-1/2 z-0 scale-75 sm:scale-90 md:scale-100 pointer-events-none transition-transform">
                        <PainterMascot />
                      </div>
                    )}

                    {unit.skills.map((skill, index) => {
                      const offsetClass = zigzagOffsets[index % zigzagOffsets.length];

                      // Mid-lesson progress sync for active skill:
                      // Priority 1: localStorage client sync (instant, reactive to user exiting mid-lesson)
                      // Priority 2: API skill.mid_progress
                      const midProgress =
                        clientMidProgress[skill.id] !== undefined
                          ? clientMidProgress[skill.id]
                          : skill.mid_progress !== undefined
                          ? skill.mid_progress
                          : undefined;

                      return (
                        <div
                          key={skill.id}
                          className={`relative z-10 transition-transform duration-200 ${offsetClass}`}
                        >
                          <SkillNode
                            id={skill.id}
                            name={skill.name}
                            status={skill.status}
                            progress={skill.progress}
                            totalLessons={skill.total_lessons}
                            progressPercent={skill.status === "active" ? midProgress : undefined}
                            icon={skill.icon}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Section 2: Coming Soon Unit Header (Yellow) */}
            <div className="w-full bg-[#FFC800] rounded-3xl p-6 text-white my-8 shadow-sm flex items-center justify-between select-none transition-colors border-b-4 border-[#E5A800]">
              <div>
                <div className="uppercase tracking-widest text-xs font-black opacity-90 mb-1 flex items-center gap-1.5 text-white">
                  <Lock className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Section 2</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                  Section 2: Coming Soon
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-white/95">
                  Complete all units in Section 1 to unlock intermediate German topics!
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white flex-shrink-0 shadow-inner ml-4">
                <Lock className="w-6 h-6 stroke-[3]" />
              </div>
            </div>
          </>
        )}
        </div>

        {/* Right Sidebar on Desktop */}
        <div className="hidden lg:flex w-80 lg:w-[340px] xl:w-[360px] flex-col gap-4 flex-shrink-0 sticky top-6">
          <DailyGoalWidget />
          <SuperSidebarCard onUpgradeClick={() => setIsSuperModalOpen(true)} />
        </div>

        {/* Mobile / Tablet Card at Bottom */}
        <div className="lg:hidden w-full max-w-2xl mt-4 flex flex-col gap-4">
          <DailyGoalWidget />
          <SuperSidebarCard onUpgradeClick={() => setIsSuperModalOpen(true)} />
        </div>
      </div>

      {/* Super Duolingo Interactive Modal */}
      <SuperModal
        isOpen={isSuperModalOpen}
        onClose={() => setIsSuperModalOpen(false)}
      />
    </AppLayout>
  );
}
