import spotifyApi from "./spotify";

export default async function getShow({ id, token }) {
  spotifyApi.setAccessToken(token);

  try {
    let showData = (await spotifyApi.getShow(id)).body;

    if (showData?.episodes.next) {
      let urls = [];
      const parts = Math.floor(showData.episodes.total / 50);

      for (let i = 1; i <= parts; i++) {
        urls.push(
          showData.episodes.next.replace("offset=50", `offset=${i * 50}`)
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
        showData = {
          ...showData,
          episodes: {
            ...showData.episodes,
            items: showData.episodes.items.concat(allTracks[i].items),
          },
        };
      }
    }

    return showData;
  } catch (err) {
    return null;
  }
}
