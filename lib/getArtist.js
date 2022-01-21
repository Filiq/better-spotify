import spotifyApi from "./spotify";

export default async function getArtist({ id, token }) {
  spotifyApi.setAccessToken(token);

  try {
    let artistData = (await spotifyApi.getArtist(id)).body;

    return artistData;
  } catch (err) {
    return null;
  }
}
