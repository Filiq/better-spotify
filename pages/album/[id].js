import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Profile from "../../components/Profile";
import Songs from "../../components/Songs";
import Player from "../../components/Player";
import getColor from "../../lib/getColor";
import { useEffect, useState } from "react";
import getAlbum from "../../lib/getAlbum";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function AlbumPage({ album }) {
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
              src={album?.images?.[0]?.url}
              alt=""
            />
            <div>
              <p>PLAYLIST</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {album?.name}{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  <span className="font-bold">
                    {album?.artists?.map((artist, idx) => (
                      <>
                        <Link href={`/artist/${artist?.id}`} key={idx}>
                          <a>{artist?.name}</a>
                        </Link>
                        {idx !== album?.artists?.length - 1 ? ", " : ""}
                      </>
                    ))}
                  </span>
                  {", "}
                  {album?.tracks.total} track
                  {album?.tracks.total !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <Songs
              playlist={album.tracks?.items}
              albumImage={album?.images?.[0]?.url}
            />
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

  const album = await getAlbum({ id, token: session.user.accessToken });

  if (!album) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      album,
    },
  };
}
