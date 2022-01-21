import spotifyApi from "./spotify";

export default async function checkIfUsersFollowPlaylist({
  owner_id,
  playlist_id,
  user_id,
  token,
}) {
  spotifyApi.setAccessToken(token);

  try {
    let checkIfUsersFollowPlaylistData = (
      await spotifyApi.areFollowingPlaylist(owner_id, playlist_id, [user_id])
    ).body;

    return checkIfUsersFollowPlaylistData;
  } catch (err) {
    return null;
  }
}
