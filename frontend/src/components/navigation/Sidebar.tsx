"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Shield, Trophy, Store, UserCircle } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Learn",
      href: "/",
      icon: <BookOpen className="w-6 h-6 stroke-[2.5]" />,
    },
    {
      label: "Leaderboards",
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
    <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[#e5e5e5] h-screen sticky top-0 px-4 py-6 bg-white z-20">
      {/* Duolingo Brand Title */}
      <div className="px-4 mb-8">
        <Link href="/">
          <span className="text-3xl font-black text-[#58CC02] tracking-wider cursor-pointer">
            duolingo
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-extrabold uppercase text-sm tracking-wider cursor-pointer transition-all border-2 ${
                  isActive
                    ? "bg-[#ddf4ff] text-[#1cb0f6] border-[#84d8ff]"
                    : "text-[#777777] border-transparent hover:bg-[#f7f7f7]"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
