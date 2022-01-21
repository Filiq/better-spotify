import spotifyApi from "./spotify";

export default async function getArtistAlbums({ token, id, country = "US" }) {
  spotifyApi.setAccessToken(token);

  try {
    let albumsData = (await spotifyApi.getArtistAlbums(id, { country })).body;

    return albumsData;
  } catch (err) {
    return null;
  }
}
