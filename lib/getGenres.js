import spotifyApi from "./spotify";

export default async function getGenres({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let genresData = (await spotifyApi.getAvailableGenreSeeds()).body;

    return genresData;
  } catch (err) {
    return null;
  }
}
