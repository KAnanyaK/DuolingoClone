"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkillNode, SkillStatus } from "@/components/path/SkillNode";
import { Button } from "@/components/ui/Button";
import { BookOpen, Lock } from "lucide-react";

interface SkillItem {
  id: number;
  name: string;
  status: SkillStatus;
  progress: number;
  total_lessons: number;
  icon: string;
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

export default function Home() {
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/courses/1/path")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch path data");
        return res.json();
      })
      .then((data: PathData) => {
        setPathData(data);
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
                { id: 2, name: "Basics 1", status: "active", progress: 1, total_lessons: 4, icon: "book" },
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
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 flex flex-col items-center">
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
                      <Button
                        variant="default"
                        size="sm"
                        className={`hidden sm:inline-flex ${unitColorConfig.textColor} font-black border-2 border-white/60 bg-white shadow-sm`}
                      >
                        <BookOpen className="w-4 h-4 mr-1.5" /> Guidebook
                      </Button>
                    )}
                  </div>

                  {/* Zigzag Path Column */}
                  <div className="flex flex-col items-center gap-10 sm:gap-14 py-4 w-full">
                    {unit.skills.map((skill, index) => {
                      const offsetClass = zigzagOffsets[index % zigzagOffsets.length];

                      return (
                        <div
                          key={skill.id}
                          className={`transition-transform duration-200 ${offsetClass}`}
                        >
                          <SkillNode
                            id={skill.id}
                            name={skill.name}
                            status={skill.status}
                            progress={skill.progress}
                            totalLessons={skill.total_lessons}
                            icon={skill.icon}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Gray Disabled Container: Section 2: Coming Soon */}
            <div className="w-full bg-[#f2f2f2] border-2 border-dashed border-[#d6d6d6] rounded-3xl p-8 my-8 text-center flex flex-col items-center justify-center opacity-70 select-none">
              <div className="w-12 h-12 rounded-full bg-[#e5e5e5] flex items-center justify-center text-[#afafaf] mb-3">
                <Lock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black text-[#8f8f8f] uppercase tracking-wider mb-1">
                Section 2: Coming Soon
              </h3>
              <p className="text-xs font-bold text-[#afafaf]">
                Complete all units in Section 1 to unlock intermediate German topics!
              </p>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
