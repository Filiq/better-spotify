import spotifyApi from "./spotify";

export default async function getAlbum({ id, token }) {
  spotifyApi.setAccessToken(token);

  try {
    let albumData = (await spotifyApi.getAlbum(id)).body;

    if (albumData?.tracks.next) {
      let urls = [];
      const parts = Math.floor(albumData.tracks.total / 100);

      for (let i = 1; i <= parts; i++) {
        urls.push(
          albumData.tracks.next.replace("offset=100", `offset=${i * 100}`)
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
        albumData = {
          ...albumData,
          tracks: {
            ...albumData.tracks,
            items: albumData.tracks.items.concat(allTracks[i].items),
          },
        };
      }
    }

    return albumData;
  } catch (err) {
    return null;
  }
}
