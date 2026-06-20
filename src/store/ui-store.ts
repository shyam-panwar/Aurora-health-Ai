import { create } from 'zustand';

type UiState = {
  isRecording: boolean;
  isPlayingAudio: boolean;
  activeSheet: string | null;
  setRecording: (value: boolean) => void;
  setPlayingAudio: (value: boolean) => void;
  setActiveSheet: (sheet: string | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isRecording: false,
  isPlayingAudio: false,
  activeSheet: null,
  setRecording: (value) => set({ isRecording: value }),
  setPlayingAudio: (value) => set({ isPlayingAudio: value }),
  setActiveSheet: (sheet) => set({ activeSheet: sheet }),
}));
