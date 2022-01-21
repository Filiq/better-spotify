import spotifyApi from "./spotify";

export default async function getLikedPlaylist({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let playlistData = (await spotifyApi.getMySavedTracks({ limit: 50 })).body;

    if (playlistData?.next) {
      let urls = [];
      const parts = Math.floor(playlistData.tracks.total / 50);

      for (let i = 1; i <= parts; i++) {
        urls.push(playlistData.next.replace("offset=50", `offset=${i * 50}`));
      }

      const allTracks = await Promise.all(
        urls.map(async (url) => {
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          return await res.json();
        })
      );

      for (let i = 0; i < parts; i++) {
        playlistData = {
          ...playlistData,
          items: playlistData.items.concat(allTracks[i].items),
        };
      }
    }

    playlistData.items.map((item) => (item.track.liked = true));

    return playlistData;
  } catch (err) {
    return null;
  }
}
