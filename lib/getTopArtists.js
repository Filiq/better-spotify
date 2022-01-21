import spotifyApi from "./spotify";

export default async function getTopArtists({
  token,
  time_range = "long_range",
}) {
  spotifyApi.setAccessToken(token);

  try {
    let artistsData = (
      await spotifyApi.getMyTopArtists({ limit: 50, time_range })
    ).body;

    if (artistsData?.next) {
      let urls = [];
      const parts = Math.floor(artistsData.total / 50);
      for (let i = 1; i <= parts; i++) {
        urls.push(artistsData.next.replace("offset=50", `offset=${i * 50}`));

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
          artistsData = {
            ...artistsData,
            items: artistsData.items.concat(allArtists[i].items),
          };
        }
      }
    }

    return artistsData;
  } catch (err) {
    return null;
  }
}
