import spotifyApi from "./spotify";

export default async function getPlaylist({ id, token }) {
  spotifyApi.setAccessToken(token);

  try {
    let playlistData = (await spotifyApi.getPlaylist(id)).body;

    if (playlistData?.tracks.next) {
      let urls = [];
      const parts = Math.floor(playlistData.tracks.total / 100);

      for (let i = 1; i <= parts; i++) {
        urls.push(
          playlistData.tracks.next.replace("offset=100", `offset=${i * 100}`)
        );
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
          tracks: {
            ...playlistData.tracks,
            items: playlistData.tracks.items.concat(allTracks[i].items),
          },
        };
      }
    }

    return playlistData;
  } catch (err) {
    return null;
  }
}
