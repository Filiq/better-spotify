import spotifyApi from "./spotify";

export default async function getUser({ id, token }) {
  spotifyApi.setAccessToken(token);

  try {
    const userData = (await spotifyApi.getUser(id)).body;

    return userData;
  } catch (err) {
    return null;
  }
}
