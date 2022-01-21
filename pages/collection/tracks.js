import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Player from "../../components/Player";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";
import Songs from "../../components/Songs";
import getColor from "../../lib/getColor";
import getLikedPlaylist from "../../lib/getLikedPlaylist";

export default function TracksPage({ playlist }) {
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
              <p>PLAYLIST</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                Liked Songs{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  {playlist.total} track{playlist.total !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <Songs playlist={playlist?.items} playlist_id={playlist.id} />
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

  const playlist = await getLikedPlaylist({ token: session.user.accessToken });

  if (!playlist) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      playlist,
    },
  };
}
