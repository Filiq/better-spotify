import Sidebar from "../components/Sidebar";
import { getSession } from "next-auth/react";
import Player from "../components/Player";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Playlists from "../components/Playlists";
import { useEffect, useState } from "react";
import getColor from "../lib/getColor";
import getPlaylists from "../lib/getPlaylists";
import Profile from "../components/Profile";

export default function HomePage({ playlists }) {
  const [color, setColor] = useState(null);

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
                Your Playlists{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  Created by <span className="font-bold">You</span>
                  {", "}
                  {playlists.total} playlist{playlists.total !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <Playlists playlists={playlists?.items} />
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

  const playlists = await getPlaylists({
    id: session.user.username,
    token: session.user.accessToken,
  });

  if (!playlists) {
    return {
      props: {
        session,
        playlists: [],
      },
    };
  }

  return {
    props: {
      session,
      playlists,
    },
  };
}
