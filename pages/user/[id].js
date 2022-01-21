import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Profile from "../../components/Profile";
import Player from "../../components/Player";
import getColor from "../../lib/getColor";
import { useEffect, useState } from "react";
import getUser from "../../lib/getUser";
import getPlaylists from "../../lib/getPlaylists";
import { getSession } from "next-auth/react";
import formatNumber from "../../lib/formatNumber";
import Playlists from "../../components/Playlists";

export default function UserPage({ user, playlists }) {
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
              src={user?.images?.[0]?.url ? user.images[0].url : "/profile.png"}
              alt=""
            />
            <div>
              <p>PROFILE</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {user?.display_name}{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  {formatNumber(user?.followers?.total)} follower
                  {user?.followers?.total !== 1 ? "s" : ""}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <div className="flex flex-col md:flex-row">
              {playlists?.items?.filter((playlist) => playlist.public) && (
                <div>
                  <h2 className="px-8 text-xl font-bold text-white md:text-2xl xl:text-3xl">
                    Public Playlists
                  </h2>
                  <Playlists
                    playlists={playlists?.items?.filter(
                      (playlist) => playlist.public
                    )}
                  />
                </div>
              )}
            </div>
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

  const user = await getUser({ id, token: session.user.accessToken });
  const playlists = await getPlaylists({ id, token: session.user.accessToken });

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      playlists,
    },
  };
}
