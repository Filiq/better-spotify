import spotifyApi from "./spotify";

export default async function getCategories({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let categoriesData = (await spotifyApi.getCategories({ limit: 50 })).body;

    if (categoriesData?.next) {
      let urls = [];
      const parts = Math.floor(categoriesData.total / 50);
      for (let i = 1; i <= parts; i++) {
        urls.push(categoriesData.next.replace("offset=50", `offset=${i * 50}`));

        const allCategories = await Promise.all(
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
          categoriesData = {
            ...categoriesData,
            items: categoriesData.items.concat(allCategories[i].items),
          };
        }
      }
    }

    return categoriesData;
  } catch (err) {
    return null;
  }
}
