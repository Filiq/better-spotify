import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Player from "../../components/Player";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";
import Artists from "../../components/Artists";
import getColor from "../../lib/getColor";
import getLikedArtists from "../../lib/getLikedArtists";

export default function ArtistsPage({ artists }) {
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
              <p>ARTISTS</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                Followed Artists{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  {artists.items.length} artist
                  {artists.items.length !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <Artists artists={artists?.items} />
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

  const artists = await getLikedArtists({ token: session.user.accessToken });

  if (!artists) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      artists,
    },
  };
}
