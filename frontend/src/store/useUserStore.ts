import { create } from "zustand";

export interface UserState {
  hearts: number;
  maxHearts: number;
  xp: number;
  streak: number;
  gems: number;
  currentCourse: {
    id: number;
    title: string;
    flag: string;
  };
  // Actions
  decrementHearts: () => void;
  refillHearts: () => void;
  setHearts: (hearts: number) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  addGems: (amount: number) => void;
  setStats: (stats: { hearts?: number; xp?: number; streak?: number; gems?: number }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  hearts: 5,
  maxHearts: 5,
  xp: 0,
  streak: 1,
  gems: 500,
  currentCourse: {
    id: 1,
    title: "German",
    flag: "🇩🇪",
  },
  decrementHearts: () =>
    set((state) => ({
      hearts: Math.max(0, state.hearts - 1),
    })),
  refillHearts: () =>
    set((state) => ({
      hearts: state.maxHearts,
    })),
  setHearts: (hearts) =>
    set({
      hearts,
    }),
  addXp: (amount) =>
    set((state) => ({
      xp: state.xp + amount,
    })),
  incrementStreak: () =>
    set((state) => ({
      streak: state.streak + 1,
    })),
  addGems: (amount) =>
    set((state) => ({
      gems: state.gems + amount,
    })),
  setStats: (stats) =>
    set((state) => ({
      ...state,
      ...stats,
    })),
}));
