import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Profile from "../../components/Profile";
import Songs from "../../components/Songs";
import Player from "../../components/Player";
import getColor from "../../lib/getColor";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import formatNumber from "../../lib/formatNumber";
import Link from "next/link";
import PlaylistHeader from "../../components/PlaylistHeader";
import getGenre from "../../lib/getGenre";
import capitalizeFirstLetter from "../../lib/capitalizeFirstLetter";

export default function GenrePage({ genre, tracks }) {
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
          <section
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
          >
            <div>
              <p>GENRE</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {genre
                  .split(" ")
                  .map(
                    (word, idx, arr) =>
                      `${capitalizeFirstLetter(word)}${
                        idx === arr.length - 1 ? "" : " "
                      }`
                  )}{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  {tracks.length} track
                  {tracks.length !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <Songs playlist={tracks} />
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

  const { tracks } = await getGenre({
    token: session.user.accessToken,
    id,
  });

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
      genre: id,
    },
  };
}
