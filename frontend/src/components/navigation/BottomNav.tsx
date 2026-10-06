"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Shield, Trophy, Store, UserCircle } from "lucide-react";
import { NavItem } from "./Sidebar";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Learn",
      href: "/",
      icon: <BookOpen className="w-6 h-6 stroke-[2.5]" />,
    },
    {
      label: "Rank",
      href: "/leaderboard",
      icon: <Shield className="w-6 h-6 stroke-[2.5]" />,
    },
    {
      label: "Quests",
      href: "/quests",
      icon: <Trophy className="w-6 h-6 stroke-[2.5]" />,
    },
    {
      label: "Shop",
      href: "/shop",
      icon: <Store className="w-6 h-6 stroke-[2.5]" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <UserCircle className="w-6 h-6 stroke-[2.5]" />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#e5e5e5] px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                isActive
                  ? "text-[#1cb0f6]"
                  : "text-[#777777] hover:text-[#4b4b4b]"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  isActive ? "bg-[#ddf4ff] border-2 border-[#84d8ff]" : ""
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-tight mt-0.5">
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};
