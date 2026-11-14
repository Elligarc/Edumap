import { create } from 'zustand'

export interface UiState {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
