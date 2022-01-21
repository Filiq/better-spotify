import spotifyApi from "./spotify";

export default async function getLikedArtists({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let artistsData = (await spotifyApi.getFollowedArtists({ limit: 50 })).body;

    if (artistsData?.next) {
      let urls = [];
      const parts = Math.floor(artistsData.tracks.total / 50);

      for (let i = 1; i <= parts; i++) {
        urls.push(artistsData.next.replace("offset=50", `offset=${i * 50}`));
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
        artistsData = {
          ...artistsData,
          items: artistsData.items.concat(allTracks[i].items),
        };
      }
    }

    return artistsData.artists;
  } catch (err) {
    return null;
  }
}
