import { create } from "zustand";
import { API_BASE_URL } from "@/config/api";

export interface UserState {
  hearts: number;
  maxHearts: number;
  xp: number;
  streak: number;
  gems: number;
  isHeartsModalOpen: boolean;
  heartsCooldownEndTime: number | null; // Timestamp (ms) when 10min timer completes
  darkMode: boolean;
  streakFreezeActive: boolean;
  dailyEarnedXp: number;
  selectedGoalXp: number;
  isDailyGoalAchieved: boolean;
  currentCourse: {
    id: number;
    title: string;
    flag: string;
  };
  // Actions
  toggleDarkMode: (enabled?: boolean) => void;
  setSelectedGoalXp: (goal: number) => void;
  setDailyEarnedXp: (amount: number) => void;
  setDailyGoalAchieved: (achieved: boolean) => void;
  addDailyXp: (amount: number) => void;
  setStreakFreezeActive: (active: boolean) => void;
  equipStreakFreeze: () => Promise<boolean>;
  unequipStreakFreeze: () => Promise<boolean>;
  decrementHearts: () => void;
  refillHearts: () => void;
  setHearts: (hearts: number) => void;
  setIsHeartsModalOpen: (isOpen: boolean) => void;
  startHeartsCooldown: () => void;
  clearHeartsCooldown: () => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  addGems: (amount: number) => void;
  setStats: (stats: {
    hearts?: number;
    xp?: number;
    streak?: number;
    gems?: number;
    streakFreezeActive?: boolean;
    streak_freeze_active?: boolean;
    heartsCooldownEndTime?: number | null;
    dailyEarnedXp?: number;
    selectedGoalXp?: number;
    isDailyGoalAchieved?: boolean;
  }) => void;
}

// Helpers for localStorage sync
const getStoredCooldown = (): number | null => {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem("duo_hearts_cooldown");
  if (!val) return null;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? null : parsed;
};

const setStoredCooldown = (timestamp: number | null) => {
  if (typeof window === "undefined") return;
  if (timestamp) {
    localStorage.setItem("duo_hearts_cooldown", timestamp.toString());
  } else {
    localStorage.removeItem("duo_hearts_cooldown");
  }
};

const getStoredHearts = (): number | null => {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem("duo_hearts_count");
  if (val === null) return null;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? null : parsed;
};

const setStoredHearts = (hearts: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_hearts_count", hearts.toString());
};

const getStoredXp = (): number => {
  if (typeof window === "undefined") return 50;
  const val = localStorage.getItem("duo_user_xp");
  if (!val) return 50;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 50 : parsed;
};

const setStoredXp = (xp: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_user_xp", xp.toString());
};

const getStoredStreak = (): number => {
  if (typeof window === "undefined") return 1;
  const val = localStorage.getItem("duo_user_streak");
  if (!val) return 1;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 1 : parsed;
};

const setStoredStreak = (streak: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_user_streak", streak.toString());
};

const getStoredGems = (): number => {
  if (typeof window === "undefined") return 500;
  const val = localStorage.getItem("duo_user_gems");
  if (!val) return 500;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 500 : parsed;
};

const setStoredGems = (gems: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_user_gems", gems.toString());
};

const getStoredDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("duo_dark_mode") === "true";
};

const setStoredDarkMode = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_dark_mode", enabled ? "true" : "false");
  if (enabled) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const getTodayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const getStoredDailyGoalAchieved = (): boolean => {
  if (typeof window === "undefined") return false;
  const flag = localStorage.getItem("duo_daily_goal_achieved");
  const date = localStorage.getItem("duo_daily_goal_achieved_date");
  const today = getTodayKey();
  return flag === "true" && (date === today || !date);
};

const setStoredDailyGoalAchieved = (achieved: boolean) => {
  if (typeof window === "undefined") return;
  const today = getTodayKey();
  localStorage.setItem("duo_daily_goal_achieved", achieved ? "true" : "false");
  if (achieved) {
    localStorage.setItem("duo_daily_goal_achieved_date", today);
  }
};

const getStoredDailyGoal = (): number => {
  if (typeof window === "undefined") return 20;
  const val = localStorage.getItem("duo_selected_goal_xp");
  if (!val) return 20;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 20 : parsed;
};

const setStoredDailyGoal = (target: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_selected_goal_xp", target.toString());
};

const getStoredDailyEarnedXp = (): number => {
  if (typeof window === "undefined") return 10;
  const isAchieved = getStoredDailyGoalAchieved();
  const goal = getStoredDailyGoal();
  const val = localStorage.getItem("duo_daily_earned_xp");
  let parsed = val !== null ? parseInt(val, 10) : 10;
  if (isNaN(parsed)) parsed = 10;
  if (isAchieved && parsed < goal) {
    parsed = goal;
  }
  return parsed;
};

const setStoredDailyEarnedXp = (amount: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_daily_earned_xp", amount.toString());
  const goal = getStoredDailyGoal();
  if (amount >= goal) {
    setStoredDailyGoalAchieved(true);
  }
};

const getStoredStreakFreeze = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("duo_streak_freeze_active") === "true";
};

const setStoredStreakFreeze = (active: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("duo_streak_freeze_active", active ? "true" : "false");
};

export const useUserStore = create<UserState>((set) => ({
  hearts: 5,
  maxHearts: 5,
  xp: 50, // 5 completed lessons * 10 XP
  streak: 1,
  gems: 500,
  isHeartsModalOpen: false,
  heartsCooldownEndTime: null,
  darkMode: false,
  streakFreezeActive: getStoredStreakFreeze(),
  dailyEarnedXp: getStoredDailyEarnedXp(),
  selectedGoalXp: getStoredDailyGoal(),
  isDailyGoalAchieved: getStoredDailyGoalAchieved(),
  currentCourse: {
    id: 1,
    title: "German",
    flag: "🇩🇪",
  },
  toggleDarkMode: (enabled) =>
    set((state) => {
      const nextMode = enabled !== undefined ? enabled : !state.darkMode;
      setStoredDarkMode(nextMode);
      return { darkMode: nextMode };
    }),
  setStreakFreezeActive: (active) => {
    setStoredStreakFreeze(active);
    return set({ streakFreezeActive: active });
  },
  equipStreakFreeze: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/1/equip-freeze`, {
        method: "POST",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to equip streak freeze");
      }
      const data = await res.json();
      setStoredStreakFreeze(true);
      if (typeof data.gems === "number") {
        setStoredGems(data.gems);
      }
      set((state) => ({
        streakFreezeActive: true,
        gems: typeof data.gems === "number" ? data.gems : Math.max(0, state.gems - 100),
      }));
      return true;
    } catch (err) {
      console.error("equipStreakFreeze error:", err);
      return false;
    }
  },
  unequipStreakFreeze: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/1/unequip-freeze`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to unequip streak freeze");
      }
      const data = await res.json();
      setStoredStreakFreeze(false);
      if (typeof data.gems === "number") {
        setStoredGems(data.gems);
      }
      set((state) => ({
        streakFreezeActive: false,
        gems: typeof data.gems === "number" ? data.gems : state.gems + 100,
      }));
      return true;
    } catch (err) {
      console.error("unequipStreakFreeze error:", err);
      return false;
    }
  },
  setSelectedGoalXp: (goal) =>
    set((state) => {
      setStoredDailyGoal(goal);
      const isReached = state.dailyEarnedXp >= goal;
      setStoredDailyGoalAchieved(isReached);
      return { selectedGoalXp: goal, isDailyGoalAchieved: isReached };
    }),
  setDailyEarnedXp: (amount) =>
    set((state) => {
      setStoredDailyEarnedXp(amount);
      const goal = state.selectedGoalXp || getStoredDailyGoal();
      const reached = amount >= goal || state.isDailyGoalAchieved || getStoredDailyGoalAchieved();
      if (reached) {
        setStoredDailyGoalAchieved(true);
      }
      return { dailyEarnedXp: amount, isDailyGoalAchieved: reached };
    }),
  setDailyGoalAchieved: (achieved) =>
    set((state) => {
      setStoredDailyGoalAchieved(achieved);
      const goal = state.selectedGoalXp || getStoredDailyGoal();
      const effectiveDaily = achieved ? Math.max(state.dailyEarnedXp, goal) : state.dailyEarnedXp;
      setStoredDailyEarnedXp(effectiveDaily);
      return { isDailyGoalAchieved: achieved, dailyEarnedXp: effectiveDaily };
    }),
  addDailyXp: (amount) =>
    set((state) => {
      const nextDaily = state.dailyEarnedXp + amount;
      const currentGoal = state.selectedGoalXp || getStoredDailyGoal();
      const reached = nextDaily >= currentGoal || state.isDailyGoalAchieved || getStoredDailyGoalAchieved();
      setStoredDailyEarnedXp(nextDaily);
      if (reached) {
        setStoredDailyGoalAchieved(true);
      }
      return { dailyEarnedXp: nextDaily, isDailyGoalAchieved: reached };
    }),
  decrementHearts: () =>
    set((state) => {
      const nextHearts = Math.max(0, state.hearts - 1);
      setStoredHearts(nextHearts);

      let cooldown = state.heartsCooldownEndTime || getStoredCooldown();
      if (nextHearts === 0 && !cooldown) {
        cooldown = Date.now() + 10 * 60 * 1000;
        setStoredCooldown(cooldown);
      }

      // Sync hearts change to backend asynchronously
      fetch(`${API_BASE_URL}/api/users/1/sync-hearts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hearts: nextHearts }),
      }).catch(() => {});

      return {
        hearts: nextHearts,
        heartsCooldownEndTime: cooldown,
      };
    }),
  refillHearts: () => {
    setStoredHearts(5);
    setStoredCooldown(null);
    return set((state) => ({
      hearts: state.maxHearts,
      heartsCooldownEndTime: null,
      isHeartsModalOpen: false,
    }));
  },
  setHearts: (hearts) => {
    setStoredHearts(hearts);
    let cooldown = null;
    if (hearts === 0) {
      cooldown = getStoredCooldown() || Date.now() + 10 * 60 * 1000;
      setStoredCooldown(cooldown);
    } else {
      setStoredCooldown(null);
    }
    return set({
      hearts,
      heartsCooldownEndTime: cooldown,
    });
  },
  setIsHeartsModalOpen: (isOpen) =>
    set({
      isHeartsModalOpen: isOpen,
    }),
  startHeartsCooldown: () =>
    set((state) => {
      const existing = state.heartsCooldownEndTime || getStoredCooldown();
      const cooldown = existing || Date.now() + 10 * 60 * 1000;
      setStoredCooldown(cooldown);
      return {
        heartsCooldownEndTime: cooldown,
      };
    }),
  clearHeartsCooldown: () => {
    setStoredCooldown(null);
    return set({
      heartsCooldownEndTime: null,
    });
  },
  addXp: (amount) =>
    set((state) => {
      const nextXp = state.xp + amount;
      const nextDaily = state.dailyEarnedXp + amount;
      const currentGoal = state.selectedGoalXp || getStoredDailyGoal();
      const reached = nextDaily >= currentGoal || state.isDailyGoalAchieved || getStoredDailyGoalAchieved();
      setStoredXp(nextXp);
      setStoredDailyEarnedXp(nextDaily);
      if (reached) {
        setStoredDailyGoalAchieved(true);
      }
      return {
        xp: nextXp,
        dailyEarnedXp: nextDaily,
        isDailyGoalAchieved: reached,
      };
    }),
  incrementStreak: () =>
    set((state) => {
      const nextStreak = state.streak + 1;
      setStoredStreak(nextStreak);
      return {
        streak: nextStreak,
      };
    }),
  addGems: (amount) =>
    set((state) => {
      const nextGems = Math.max(0, state.gems + amount);
      setStoredGems(nextGems);
      return {
        gems: nextGems,
      };
    }),
  setStats: (stats) =>
    set((state) => {
      if (typeof stats.hearts === "number") {
        setStoredHearts(stats.hearts);
      }
      let nextDaily = typeof stats.dailyEarnedXp === "number"
        ? stats.dailyEarnedXp
        : (getStoredDailyEarnedXp() || state.dailyEarnedXp);

      if (typeof stats.xp === "number") {
        setStoredXp(stats.xp);
        if (stats.xp > state.xp) {
          nextDaily = nextDaily + (stats.xp - state.xp);
        }
      }

      const currentGoal = stats.selectedGoalXp || state.selectedGoalXp || getStoredDailyGoal();
      let isAchieved = stats.isDailyGoalAchieved ?? (state.isDailyGoalAchieved || getStoredDailyGoalAchieved() || nextDaily >= currentGoal);
      if (isAchieved) {
        setStoredDailyGoalAchieved(true);
        if (nextDaily < currentGoal) {
          nextDaily = currentGoal;
        }
      }
      setStoredDailyEarnedXp(nextDaily);

      if (typeof stats.gems === "number") {
        setStoredGems(stats.gems);
      }
      if (typeof stats.streak === "number") {
        setStoredStreak(stats.streak);
      }
      if (stats.heartsCooldownEndTime !== undefined) {
        setStoredCooldown(stats.heartsCooldownEndTime);
      }
      let freezeVal = state.streakFreezeActive;
      if (typeof stats.streakFreezeActive === "boolean") {
        freezeVal = stats.streakFreezeActive;
        setStoredStreakFreeze(freezeVal);
      } else if (typeof stats.streak_freeze_active === "boolean") {
        freezeVal = stats.streak_freeze_active;
        setStoredStreakFreeze(freezeVal);
      }
      return {
        ...state,
        ...stats,
        dailyEarnedXp: nextDaily,
        selectedGoalXp: currentGoal,
        isDailyGoalAchieved: isAchieved,
        streakFreezeActive: freezeVal,
      };
    }),
}));
