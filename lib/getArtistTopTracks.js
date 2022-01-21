import spotifyApi from "./spotify";

export default async function getArtistTopTracks({
  token,
  id,
  country = "US",
}) {
  spotifyApi.setAccessToken(token);

  try {
    let tracksData = (await spotifyApi.getArtistTopTracks(id, country)).body;

    return tracksData;
  } catch (err) {
    return null;
  }
}
