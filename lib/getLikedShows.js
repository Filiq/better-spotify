import spotifyApi from "./spotify";

export default async function getLikedShows({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let showsData = (await spotifyApi.getMySavedShows({ limit: 50 })).body;

    if (showsData?.next) {
      let urls = [];
      const parts = Math.floor(showsData.episodes.total / 50);

      for (let i = 1; i <= parts; i++) {
        urls.push(showsData.next.replace("offset=50", `offset=${i * 50}`));
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
        showsData = {
          ...showsData,
          items: showsData.items.concat(allEpisodes[i].items),
        };
      }
    }

    return showsData;
  } catch (err) {
    return null;
  }
}
