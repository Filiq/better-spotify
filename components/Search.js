import { shuffle } from "lodash";
import { useState, useEffect } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import Playlists from "./Playlists";
import Albums from "./Albums";
import Artists from "./Artists";
import Shows from "./Shows";
import Episodes from "./Episodes";
import Genres from "./Genres";

export default function Search({ genres }) {
  const [color, setColor] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const spotifyApi = useSpotify();

  const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
  ];

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  const search = () => {
    if (searchValue === "") return setSearchResult("");

    spotifyApi
      .search(searchValue, [
        "track",
        "album",
        "artist",
        "playlist",
        "show",
        "episode",
      ])
      .then((data) => {
        setSearchResult(data.body);
      });
  };

  return (
    <div className="flex-grow w-full h-screen overflow-y-scroll">
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">Search</h1>
        </div>
        <div className="relative">
          <input
            type="search"
            className="h-10 pl-10 text-black w-96 rounded-3xl"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Songs, artist, or podcasts"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
          />
          <SearchIcon className="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-[0.6rem]" />
        </div>
      </section>
      <div>
        {searchResult ? (
          <>
            <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
              Songs
            </h2>
            <Songs playlist={searchResult.tracks?.items} />
            <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
              Artists
            </h2>
            <Artists artists={searchResult.artists?.items} />
            <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
              Albums
            </h2>
            <Albums albums={searchResult.albums?.items} />
            <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
              Playlists
            </h2>
            <Playlists playlists={searchResult.playlists?.items} />
            <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
              Podcasts & Shows
            </h2>
            <Shows shows={searchResult.shows?.items} />
            <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
              Episodes
            </h2>
            <Episodes show={searchResult.episodes?.items} />
          </>
        ) : (
          <Genres genres={genres} />
        )}
      </div>
    </div>
  );
}
