"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LearnNavIcon,
  LeaderboardsNavIcon,
  QuestsNavIcon,
  ShopNavIcon,
  ProfileNavIcon,
  SettingsNavIcon,
} from "./NavIcons";

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
      href: "/learn",
      icon: <LearnNavIcon className="w-8 h-8" />,
    },
    {
      label: "Leaderboards",
      href: "/leaderboard",
      icon: <LeaderboardsNavIcon className="w-8 h-8" />,
    },
    {
      label: "Quests",
      href: "/quests",
      icon: <QuestsNavIcon className="w-8 h-8" />,
    },
    {
      label: "Shop",
      href: "/shop",
      icon: <ShopNavIcon className="w-8 h-8" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <ProfileNavIcon className="w-8 h-8" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <SettingsNavIcon className="w-8 h-8" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[#e5e5e5] dark:border-[#202F36] h-screen sticky top-0 px-4 py-6 bg-white dark:bg-[#131F24] z-20">
      {/* Duolingo Brand Title */}
      <div className="px-4 mb-8">
        <Link href="/learn">
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
                    ? "bg-[#ddf4ff] dark:bg-[#1B3644] text-[#1cb0f6] border-[#84d8ff] dark:border-[#216584]"
                    : "text-[#777777] dark:text-[#AFAFAF] border-transparent hover:bg-[#f7f7f7] dark:hover:bg-[#202F36]"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <span className="leading-none">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
