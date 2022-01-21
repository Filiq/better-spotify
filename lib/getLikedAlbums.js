import spotifyApi from "./spotify";

export default async function getLikedAlbums({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let albumsData = (await spotifyApi.getMySavedAlbums({ limit: 50 })).body;

    if (albumsData?.next) {
      let urls = [];
      const parts = Math.floor(albumsData.total / 50);

      for (let i = 1; i <= parts; i++) {
        urls.push(albumsData.next.replace("offset=50", `offset=${i * 50}`));
      }

      const allEpisodes = await Promise.all(
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
        albumsData = {
          ...albumsData,
          items: albumsData.items.concat(allEpisodes[i].items),
        };
      }
    }

    return albumsData;
  } catch (err) {
    return null;
  }
}
