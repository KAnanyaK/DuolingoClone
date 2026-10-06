import React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";

export interface AppLayoutProps {
  children: React.ReactNode;
  showTopBar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showTopBar = true,
}) => {
  return (
    <div className="min-h-screen flex bg-white font-nunito">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {showTopBar && <TopBar />}
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
