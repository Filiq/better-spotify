import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Profile from "../../components/Profile";
import Player from "../../components/Player";
import getColor from "../../lib/getColor";
import { useEffect, useState } from "react";
import getShow from "../../lib/getShow";
import { getSession } from "next-auth/react";
import Episodes from "../../components/Episodes";

export default function ShowPage({ show }) {
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
              src={show?.images?.[0]?.url}
              alt=""
            />
            <div>
              <p>PODCAST</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {show?.name}{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  Published by{" "}
                  <span className="font-bold">{show?.publisher}</span>
                  {", "}
                  {show.total_episodes} episode
                  {show.total_episodes !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <div>
            <Episodes show={show?.episodes?.items} />
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

  const show = await getShow({ id, token: session.user.accessToken });

  if (!show) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      show,
    },
  };
}
