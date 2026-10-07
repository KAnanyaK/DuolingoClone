import { create } from "zustand";

export interface UserState {
  hearts: number;
  maxHearts: number;
  xp: number;
  streak: number;
  gems: number;
  isHeartsModalOpen: boolean;
  heartsCooldownEndTime: number | null; // Timestamp (ms) when 10min timer completes
  darkMode: boolean;
  currentCourse: {
    id: number;
    title: string;
    flag: string;
  };
  // Actions
  toggleDarkMode: (enabled?: boolean) => void;
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
    heartsCooldownEndTime?: number | null;
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

export const useUserStore = create<UserState>((set) => ({
  hearts: 5,
  maxHearts: 5,
  xp: 50, // 5 completed lessons * 10 XP
  streak: getStoredStreak(),
  gems: 500,
  isHeartsModalOpen: false,
  heartsCooldownEndTime: null,
  darkMode: false,
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
      fetch("http://localhost:8000/api/users/1/sync-hearts", {
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
      setStoredXp(nextXp);
      return {
        xp: nextXp,
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
      if (typeof stats.xp === "number") {
        setStoredXp(stats.xp);
      }
      if (typeof stats.gems === "number") {
        setStoredGems(stats.gems);
      }
      if (typeof stats.streak === "number") {
        setStoredStreak(stats.streak);
      }
      if (stats.heartsCooldownEndTime !== undefined) {
        setStoredCooldown(stats.heartsCooldownEndTime);
      }
      return {
        ...state,
        ...stats,
      };
    }),
}));
