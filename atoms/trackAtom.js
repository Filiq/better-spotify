import { atom } from "recoil";

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const trackIdState = atom({
  key: "trackIdState",
  default: null,
});
