import { getSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Player from "../../components/Player";
import Profile from "../../components/Profile";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import getGenres from "../../lib/getGenres";

export default function SearchPage({ genres }) {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <main className="flex">
        <Sidebar />
        <Profile />
        <Search genres={genres} />
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

  const { genres } = await getGenres({ token: session.user.accessToken });

  return {
    props: {
      genres,
    },
  };
}
