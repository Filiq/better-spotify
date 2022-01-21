import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Profile from "../../components/Profile";
import Songs from "../../components/Songs";
import Player from "../../components/Player";
import getColor from "../../lib/getColor";
import { useEffect, useState } from "react";
import getPlaylist from "../../lib/getPlaylist";
import { getSession } from "next-auth/react";
import formatNumber from "../../lib/formatNumber";
import Link from "next/link";
import PlaylistHeader from "../../components/PlaylistHeader";
import EditPlaylistModal from "../../components/EditPlaylistModal";
import DeletePlaylistModal from "../../components/DeletePlaylistModal";
import checkIfUsersFollowPlaylist from "../../lib/checkIfUsersFollowPlaylist";
import getLikedPlaylist from "../../lib/getLikedPlaylist";

export default function PlaylistPage({
  playlist,
  user_id,
  isUserFollowingPlaylist,
}) {
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
              src={
                playlist?.images?.[0]?.url
                  ? playlist.images[0].url
                  : "/album-default.png"
              }
              alt=""
            />
            <div>
              <p>PLAYLIST</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {playlist?.name}{" "}
                <span className="text-xs font-normal text-gray-500 md:text-sm">
                  Created by{" "}
                  <span className="font-bold">
                    <Link
                      href={`/${playlist?.owner?.type}/${playlist?.owner?.id}`}
                    >
                      {playlist?.owner.display_name}
                    </Link>
                  </span>
                  {", "}
                  {playlist?.tracks.total} track
                  {playlist?.tracks.total !== 1 && "s"}
                  {", "}
                  {formatNumber(playlist?.followers?.total)} follower
                  {playlist?.followers?.total !== 1 && "s"}
                </span>
              </h1>
            </div>
          </section>
          <PlaylistHeader
            playlist={playlist}
            user_id={user_id}
            isUserFollowingPlaylist={isUserFollowingPlaylist}
          />
          <div>
            <Songs
              playlist={playlist?.tracks?.items}
              playlist_id={playlist?.id}
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
      <EditPlaylistModal playlist={playlist} />
      <DeletePlaylistModal playlist={playlist} />
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

  let playlist = await getPlaylist({ id, token: session.user.accessToken });

  let likedTracks = await getLikedPlaylist({
    token: session.user.accessToken,
  });

  const isUserFollowingPlaylist = await checkIfUsersFollowPlaylist({
    owner_id: playlist.owner.id,
    playlist_id: playlist.id,
    user_id: session.user.id,
    token: session.user.accessToken,
  });

  if (!playlist) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (likedTracks?.items.length > 0) {
    likedTracks = likedTracks.items.map((item) => item.track.id);

    playlist = {
      ...playlist,
      tracks: {
        ...playlist.tracks,
        items: playlist?.tracks?.items.map((item) =>
          likedTracks.indexOf(item.track.id) !== -1
            ? { ...item, track: { ...item.track, liked: true } }
            : item
        ),
      },
    };
  }

  return {
    props: {
      playlist,
      user_id: session.user.id,
      isUserFollowingPlaylist: isUserFollowingPlaylist[0],
    },
  };
}
