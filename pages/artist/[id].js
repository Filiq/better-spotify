import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Profile from "../../components/Profile";
import Player from "../../components/Player";
import getColor from "../../lib/getColor";
import { useEffect, useState } from "react";
import getArtist from "../../lib/getArtist";
import { getSession } from "next-auth/react";
import formatNumber from "../../lib/formatNumber";
import Genres from "../../components/Genres";
import ArtistPopularity from "../../components/ArtistPopularity";
import getArtistTopTracks from "../../lib/getArtistTopTracks";
import getArtistAlbums from "../../lib/getArtistAlbums";
import getArtistRelatedArtists from "../../lib/getArtistRelatedArtists";
import Songs from "../../components/Songs";
import Albums from "../../components/Albums";
import Artists from "../../components/Artists";

export default function ArtistPage({
  artist,
  artistTopTracks,
  artistAlbums,
  artistRelatedArtists,
}) {
  const [color, setColor] = useState("");

  useEffect(() => {
    setColor(getColor().from);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-black">
      <main className="flex">
        <Sidebar />
        <Profile />
        <div className="flex-grow w-full h-screen overflow-y-scroll">
          {/* //scrollbar-hide */}
          <section
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
          >
            <img
              className="object-cover shadow-2xl h-44 w-44"
              src={artist?.images?.[0]?.url}
              alt=""
            />
            <div>
              <p>ARTIST</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {artist?.name}{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  {formatNumber(artist?.followers?.total)} follower
                  {artist?.followers?.total !== 1 ? "s" : ""}
                </span>
              </h1>
            </div>
          </section>
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row pb-4">
              {artist?.genres.length !== 0 && (
                <div>
                  <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
                    Genres
                  </h2>
                  <Genres genres={artist?.genres} />
                </div>
              )}
              <div>
                <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
                  Popularity
                </h2>
                <ArtistPopularity score={artist?.popularity} />
              </div>
            </div>
            {artistTopTracks?.tracks && (
              <div>
                <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
                  Top Tracks
                </h2>
                <Songs playlist={artistTopTracks.tracks} />
              </div>
            )}
            {artistAlbums?.items && (
              <div>
                <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
                  Albums
                </h2>
                <Albums albums={artistAlbums.items} />
              </div>
            )}
            {artistRelatedArtists?.artists && (
              <div>
                <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
                  Related Artists
                </h2>
                <Artists artists={artistRelatedArtists.artists} />
              </div>
            )}
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const id = ctx.params.id;

  if (id === "") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const session = await getSession(ctx);

  let artist;
  let artistTopTracks;
  let artistAlbums;
  let artistRelatedArtists;

  await Promise.all([
    (artist = await getArtist({ id, token: session.user.accessToken })),
    (artistTopTracks = await getArtistTopTracks({
      id,
      token: session.user.accessToken,
      country: session.user.country,
    })),
    (artistAlbums = await getArtistAlbums({
      id,
      token: session.user.accessToken,
      country: session.user.country,
    })),
    (artistRelatedArtists = await getArtistRelatedArtists({
      id,
      token: session.user.accessToken,
    })),
  ]);

  if (!artist) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      artist,
      artistTopTracks,
      artistAlbums,
      artistRelatedArtists,
    },
  };
}
