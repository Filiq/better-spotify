import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Player from "../../components/Player";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";
import getColor from "../../lib/getColor";

export default function StatisticsPage() {
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
            <div>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                Statistics
              </h1>
            </div>
          </section>
          <div>
            <div className="flex flex-col items-center px-8 -ml-2 md:flex-row">
              <Link href="/statistics/tracks">
                <button
                  className={`h-20 w-36 rounded-lg m-2 ${
                    getColor().bg
                  } text-white text-lg font-semibold`}
                >
                  Top Tracks
                </button>
              </Link>
              <Link href="/statistics/artists">
                <button
                  className={`h-20 w-36 rounded-lg m-2 ${
                    getColor().bg
                  } text-white text-lg font-semibold`}
                >
                  Top Artists
                </button>
              </Link>
              <Link href="/statistics/genres">
                <button
                  className={`h-20 w-36 rounded-lg m-2 ${
                    getColor().bg
                  } text-white text-lg font-semibold`}
                >
                  Top Genres
                </button>
              </Link>
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
