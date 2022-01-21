import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Player from "../../components/Player";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";
import Shows from "../../components/Shows";
import getColor from "../../lib/getColor";
import getLikedShows from "../../lib/getLikedShows";

export default function ShowsPage({ shows }) {
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
              <p>SHOWS & PODCASTS</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                Your Podcasts{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  {shows.total} show{shows.total !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <Shows shows={shows?.items} />
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

  const shows = await getLikedShows({ token: session.user.accessToken });

  if (!shows) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      shows,
    },
  };
}
