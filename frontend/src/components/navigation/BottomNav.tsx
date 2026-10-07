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
} from "./NavIcons";
import { NavItem } from "./Sidebar";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Learn",
      href: "/learn",
      icon: <LearnNavIcon className="w-6 h-6" />,
    },
    {
      label: "Rank",
      href: "/leaderboard",
      icon: <LeaderboardsNavIcon className="w-6 h-6" />,
    },
    {
      label: "Quests",
      href: "/quests",
      icon: <QuestsNavIcon className="w-6 h-6" />,
    },
    {
      label: "Shop",
      href: "/shop",
      icon: <ShopNavIcon className="w-6 h-6" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <ProfileNavIcon className="w-6 h-6" />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#131F24] border-t-2 border-[#e5e5e5] dark:border-[#202F36] px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                isActive
                  ? "text-[#1cb0f6]"
                  : "text-[#777777] dark:text-[#AFAFAF] hover:text-[#4b4b4b] dark:hover:text-white"
              }`}
            >
              <div
                className={`p-1 rounded-xl ${
                  isActive
                    ? "bg-[#ddf4ff] dark:bg-[#1B3644] border-2 border-[#84d8ff] dark:border-[#216584]"
                    : ""
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
