import spotifyApi from "./spotify";

export default async function getMe({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let meData = (await spotifyApi.getMe()).body;

    return meData;
  } catch (err) {
    return null;
  }
}
