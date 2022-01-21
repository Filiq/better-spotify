export default function getTopGenres({ genres }) {
  try {
    let genres_count = {};

    for (let i = 0; i < genres.length; i++) {
      for (let j = 0; j < genres[i].length; j++) {
        if (genres_count.hasOwnProperty(genres[i][j])) {
          genres_count[genres[i][j]]++;
        } else {
          genres_count[genres[i][j]] = 1;
        }
      }
    }

    genres_count = Object.entries(genres_count).sort((a, b) => b[1] - a[1]);

    return genres_count;
  } catch (err) {
    return null;
  }
}
