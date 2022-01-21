import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Player from "../../components/Player";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";
import Artists from "../../components/Artists";
import getColor from "../../lib/getColor";
import getTopArtists from "../../lib/getTopArtists";

export default function TracksPage({ artists }) {
  const [color, setColor] = useState("");
  const [type, setType] = useState("long");

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
            <div>
              <p>STATISTICS</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                Top Artists
              </h1>
            </div>
          </section>
          <div className="flex items-center h-16 px-8 space-x-4 bg-black">
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
            <Artists artists={artists[type]} />
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

  let artists = {};

  await Promise.all([
    (artists.long = await getTopArtists({
      token: session.user.accessToken,
      time_range: "long_term",
    })),
    (artists.medium = await getTopArtists({
      token: session.user.accessToken,
      time_range: "medium_term",
    })),
    (artists.short = await getTopArtists({
      token: session.user.accessToken,
      time_range: "short_term",
    })),
  ]);

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
