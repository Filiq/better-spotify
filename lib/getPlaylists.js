import spotifyApi from "./spotify";

export default async function getPlaylists({ id, token }) {
  spotifyApi.setAccessToken(token);

  try {
    let playlistsData = (await spotifyApi.getUserPlaylists(id, { limit: 50 }))
      .body;

    if (playlistsData.next) {
      let urls = [];
      const parts = Math.floor(playlistsData.tracks.total / 50);

      for (let i = 1; i <= parts; i++) {
        urls.push(playlistsData.next.replace("offset=50", `offset=${i * 50}`));
      }

      const allPlaylists = await Promise.all(
        urls.map(async (url) => {
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          });

          return await res.json();
        })
      );

      for (let i = 0; i < parts; i++) {
        playlistsData = {
          ...playlistsData,
          items: playlistsData.items.concat(allPlaylists[i].items),
        };
      }
    }

    return playlistsData;
  } catch (err) {
    return null;
  }
}
