"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export interface CourseOption {
  id: string;
  code: string;
  title: string;
  flagType: "german" | "french" | "spanish";
  available: boolean;
}

export const COURSES: CourseOption[] = [
  { id: "german", code: "DE", title: "German", flagType: "german", available: true },
  { id: "french", code: "FR", title: "French", flagType: "french", available: false },
  { id: "spanish", code: "ES", title: "Spanish", flagType: "spanish", available: false },
];

interface CourseSelectorPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  activeCourseId?: string;
}

export const CourseSelectorPopover: React.FC<CourseSelectorPopoverProps> = ({
  isOpen,
  onClose,
  activeCourseId = "german",
}) => {
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking elsewhere on the screen
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectCourse = (course: CourseOption) => {
    onClose();
    if (course.id === "german") {
      router.push("/");
    } else {
      router.push(`/course/${course.id}`);
    }
  };

  const renderFlag = (flagType: CourseOption["flagType"]) => {
    if (flagType === "german") {
      return (
        <svg
          viewBox="0 0 40 28"
          className="w-8 h-5.5 rounded-md overflow-hidden filter drop-shadow-sm flex-shrink-0"
        >
          <rect width="40" height="28" rx="4" fill="#FFFFFF" />
          <rect y="0" width="40" height="9.33" fill="#202F36" />
          <rect y="9.33" width="40" height="9.33" fill="#FF4B4B" />
          <rect y="18.66" width="40" height="9.34" fill="#FFC800" />
        </svg>
      );
    }
    if (flagType === "french") {
      return (
        <svg
          viewBox="0 0 40 28"
          className="w-8 h-5.5 rounded-md overflow-hidden filter drop-shadow-sm flex-shrink-0"
        >
          <rect width="40" height="28" rx="4" fill="#FFFFFF" />
          <rect x="0" width="13.33" height="28" fill="#1CB0F6" />
          <rect x="13.33" width="13.34" height="28" fill="#FFFFFF" />
          <rect x="26.67" width="13.33" height="28" fill="#FF4B4B" />
        </svg>
      );
    }
    // Spanish flag
    return (
      <svg
        viewBox="0 0 40 28"
        className="w-8 h-5.5 rounded-md overflow-hidden filter drop-shadow-sm flex-shrink-0"
      >
        <rect width="40" height="28" rx="4" fill="#FFFFFF" />
        <rect y="0" width="40" height="7" fill="#FF4B4B" />
        <rect y="7" width="40" height="14" fill="#FFC800" />
        <rect y="21" width="40" height="7" fill="#FF4B4B" />
      </svg>
    );
  };

  return (
    <div
      ref={popoverRef}
      className="absolute top-14 left-0 z-50 w-72 rounded-3xl bg-white dark:bg-[#131F24] border-2 border-[#e5e5e5] dark:border-[#202F36] shadow-2xl p-3 font-nunito select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top pointer arrow */}
      <div className="absolute -top-2 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#e5e5e5] dark:border-b-[#202F36]" />
      <div className="absolute -top-[6px] left-8 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-white dark:border-b-[#131F24]" />

      <div className="px-3 pt-2 pb-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#afafaf] dark:text-[#777777]">
          My Courses
        </h4>
      </div>

      <div className="flex flex-col gap-1">
        {COURSES.map((course) => {
          const isSelected = activeCourseId === course.id;

          return (
            <button
              key={course.id}
              onClick={() => handleSelectCourse(course)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left ${
                isSelected
                  ? "bg-[#ddf4ff] dark:bg-[#1B3644] text-[#1CB0F6]"
                  : "hover:bg-gray-100 dark:hover:bg-[#202F36] text-[#4B4B4B] dark:text-[#E5E5E5]"
              }`}
            >
              <div className="flex items-center gap-3">
                {renderFlag(course.flagType)}
                <div className="flex flex-col">
                  <span className="font-extrabold text-base leading-tight">
                    {course.title}
                  </span>
                  <span className="text-xs font-bold text-[#afafaf] dark:text-[#93A4AC]">
                    {course.available ? "Active Course" : "New Language"}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-[#1CB0F6] flex items-center justify-center text-white">
                  <Check className="w-4 h-4 stroke-[3.5]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CourseSelectorPopover;
