import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chatlingo-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chatlingo-theme", theme);
    set({ theme });
  },
}));