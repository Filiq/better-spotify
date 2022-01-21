import spotifyApi from "./spotify";

export default async function getArtistRelatedArtists({ token, id }) {
  spotifyApi.setAccessToken(token);

  try {
    let artistsData = (await spotifyApi.getArtistRelatedArtists(id)).body;

    return artistsData;
  } catch (err) {
    return null;
  }
}
