import { atom } from "recoil";

export const myPlaylistsState = atom({
  key: "myPlaylistsState",
  default: [],
});

export const allPlaylistsState = atom({
  key: "allPlaylistsState",
  default: [],
});
