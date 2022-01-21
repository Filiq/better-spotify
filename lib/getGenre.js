import spotifyApi from "./spotify";

export default async function getGenre({ token, id }) {
  spotifyApi.setAccessToken(token);

  try {
    let tracksData = (
      await spotifyApi.getRecommendations({ seed_genres: id, limit: 50 })
    ).body;

    return tracksData;
  } catch (err) {
    return null;
  }
}
