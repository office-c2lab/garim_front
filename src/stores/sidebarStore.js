import { create } from 'zustand';

export const useSidebarStore = create(set => ({
  isMobileSidebarOpen: false,

  openMobileSidebar: () => {
    set({ isMobileSidebarOpen: true });
  },

  closeMobileSidebar: () => {
    set({ isMobileSidebarOpen: false });
  },

  toggleMobileSidebar: () => {
    set(state => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    }));
  },
}));