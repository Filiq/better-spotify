import { atom } from "recoil";

export const duplicatedSongModalState = atom({
  key: "duplicatedSongModalState",
  default: { open: false, playlist_id: null, track_uri: null },
});
