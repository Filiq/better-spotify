import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRecoilValue } from "recoil";
import { isPlayingState } from "../../atoms/trackAtom";
import Player from "../../components/Player";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";
import Songs from "../../components/Songs";
import useSpotify from "../../hooks/useSpotify";
import getColor from "../../lib/getColor";
import getTopTracks from "../../lib/getTopTracks";

export default function TracksPage({ tracks }) {
  const [color, setColor] = useState("");
  const [type, setType] = useState("long");
  const isPlaying = useRecoilValue(isPlayingState);
  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(getColor().from);
  }, []);

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body.is_playing) {
          spotifyApi.pause();
        } else {
          spotifyApi.play();
        }
      })
      .catch((err) => {
        toast.error("No active device, please turn on any device with Spotify");
      });
  };

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
            <div>
              <p>STATISTICS</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                Top Tracks
              </h1>
            </div>
          </section>
          <div className="flex items-center h-16 px-8 space-x-4 bg-black">
            <div className="relative w-16 h-16">
              <div className="absolute z-0 w-12 h-12 bg-white rounded-full top-2 left-2"></div>
              {isPlaying ? (
                <PauseIcon
                  className="w-16 h-16 text-green-500 button z-1"
                  onClick={handlePlayPause}
                />
              ) : (
                <PlayIcon
                  className="w-16 h-16 text-green-500 button z-1"
                  onClick={handlePlayPause}
                />
              )}
            </div>
            <div>
              <button
                className={`text-white mr-8 ${
                  type === "short" ? "font-bold" : "font-normal"
                }`}
                onClick={() => setType("short")}
              >
                Last 4 weeks
              </button>
              <button
                className={`text-white mr-8 ${
                  type === "medium" ? "font-bold" : "font-normal"
                }`}
                onClick={() => setType("medium")}
              >
                Last 6 months
              </button>
              <button
                className={`text-white ${
                  type === "long" ? "font-bold" : "font-normal"
                }`}
                onClick={() => setType("long")}
              >
                All Time
              </button>
            </div>
          </div>
          <div>
            <Songs playlist={tracks[type]?.items} />
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
  const session = await getSession(ctx);

  let tracks = {};

  await Promise.all([
    (tracks.long = await getTopTracks({
      token: session.user.accessToken,
      time_range: "long_term",
    })),
    (tracks.medium = await getTopTracks({
      token: session.user.accessToken,
      time_range: "medium_term",
    })),
    (tracks.short = await getTopTracks({
      token: session.user.accessToken,
      time_range: "short_term",
    })),
  ]);

  if (!tracks) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      tracks,
    },
  };
}
