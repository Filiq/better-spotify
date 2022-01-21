import spotifyApi from "./spotify";

export default async function getTopTracks({
  token,
  time_range = "long_term",
}) {
  spotifyApi.setAccessToken(token);

  try {
    let tracksData = (
      await spotifyApi.getMyTopTracks({ limit: 50, time_range })
    ).body;

    if (tracksData?.next) {
      let urls = [];
      const parts = Math.floor(tracksData.total / 50);
      for (let i = 1; i <= parts; i++) {
        urls.push(tracksData.next.replace("offset=50", `offset=${i * 50}`));

        const allArtists = await Promise.all(
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
          tracksData = {
            ...tracksData,
            items: tracksData.items.concat(allArtists[i].items),
          };
        }
      }
    }

    return tracksData;
  } catch (err) {
    return null;
  }
}
