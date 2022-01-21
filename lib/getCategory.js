import spotifyApi from "./spotify";

export default async function getRecommendations({ token, id }) {
  spotifyApi.setAccessToken(token);

  try {
    let categoryData = (await spotifyApi.getCategory({ id })).body;

    return categoryData;
  } catch (err) {
    return null;
  }
}
