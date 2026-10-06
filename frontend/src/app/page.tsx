"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkillNode, SkillStatus } from "@/components/path/SkillNode";
import { Button } from "@/components/ui/Button";
import { BookOpen } from "lucide-react";

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
        // Fallback default path data
        setPathData({
          course_id: 1,
          course_title: "German",
          units: [
            {
              id: 1,
              title: "Unit 1: Basic German Greetings",
              description: "Say hello, introduce yourself, and order basic items",
              order: 1,
              skills: [
                {
                  id: 1,
                  name: "Greetings",
                  status: "completed",
                  progress: 4,
                  total_lessons: 4,
                  icon: "star",
                },
                {
                  id: 2,
                  name: "Basics 1",
                  status: "active",
                  progress: 1,
                  total_lessons: 4,
                  icon: "book",
                },
                {
                  id: 3,
                  name: "Phrases",
                  status: "locked",
                  progress: 0,
                  total_lessons: 4,
                  icon: "message",
                },
                {
                  id: 4,
                  name: "Animals",
                  status: "locked",
                  progress: 0,
                  total_lessons: 5,
                  icon: "paw",
                },
                {
                  id: 5,
                  name: "Food",
                  status: "locked",
                  progress: 0,
                  total_lessons: 4,
                  icon: "utensils",
                },
                {
                  id: 6,
                  name: "Checkpoint 1",
                  status: "locked",
                  progress: 0,
                  total_lessons: 1,
                  icon: "trophy",
                },
              ],
            },
          ],
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Zigzag offsets array mapping sequence: Center -> Right -> Far Right -> Right -> Center -> Left -> Far Left...
  const zigzagOffsets = [
    "translate-x-0",
    "translate-x-12 sm:translate-x-16",
    "translate-x-20 sm:translate-x-28",
    "translate-x-12 sm:translate-x-16",
    "translate-x-0",
    "-translate-x-12 sm:-translate-x-16",
    "-translate-x-20 sm:-translate-x-28",
    "-translate-x-12 sm:-translate-x-16",
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
          pathData?.units.map((unit) => (
            <div key={unit.id} className="w-full flex flex-col items-center">
              {/* Unit Header Banner */}
              <div className="w-full bg-[#58CC02] rounded-3xl p-6 text-white mb-12 shadow-sm flex items-center justify-between">
                <div>
                  <div className="uppercase tracking-widest text-xs font-black opacity-80 mb-1">
                    Unit {unit.order}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black mb-1">
                    {unit.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold opacity-95">
                    {unit.description}
                  </p>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="hidden sm:inline-flex text-[#58CC02] font-black border-2 border-white/60 bg-white shadow-sm"
                >
                  <BookOpen className="w-4 h-4 mr-1.5" /> Guidebook
                </Button>
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
          ))
        )}
      </div>
    </AppLayout>
  );
}
