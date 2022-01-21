import {
  HomeIcon,
  SearchIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon,
  MusicNoteIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { createPlaylistModalState } from "../atoms/createPlaylistModalAtom";
import { myPlaylistsState, allPlaylistsState } from "../atoms/playlistsAtom";
import Link from "next/link";
import useSpotify from "../hooks/useSpotify";
import CreatePlaylistModal from "./CreatePlaylistModal";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [allPlaylists, setAllPlaylists] = useRecoilState(allPlaylistsState);
  const [myPlaylists, setMyPlaylists] = useRecoilState(myPlaylistsState);
  const [openCreatePlaylist, setOpenCreatePlaylist] = useRecoilState(
    createPlaylistModalState
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setAllPlaylists(data.body.items);
        setMyPlaylists(
          data.body.items.filter((item) => item.owner.id === session?.user?.id)
        );
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="h-screen p-5 overflow-y-scroll text-xs text-gray-500 border-r border-gray-900 scrollbar-hide lg:text-sm sm:max-w-[10rem] lg:max-w-[12rem] w-full hidden md:inline-flex">
      <div className="space-y-4">
        <Link href="/">
          <button className="flex items-center space-x-2 hover:text-white">
            <HomeIcon className="w-5 h-5" />
            <p>Home</p>
          </button>
        </Link>
        <Link href="/search">
          <button className="flex items-center space-x-2 hover:text-white">
            <SearchIcon className="w-5 h-5" />
            <p>Search</p>
          </button>
        </Link>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setOpenCreatePlaylist(true)}
        >
          <PlusCircleIcon className="w-5 h-5" />
          <p>Create Playlist</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <Link href="/collection/tracks">
          <button className="flex items-center space-x-2 hover:text-white">
            <HeartIcon className="w-5 h-5 text-blue-500" />
            <p>Liked Songs</p>
          </button>
        </Link>
        <Link href="/collection/artists">
          <button className="flex items-center space-x-2 hover:text-white">
            <UserIcon className="w-5 h-5 text-red-500" />
            <p>Followed Artists</p>
          </button>
        </Link>
        <Link href="/collection/albums">
          <button className="flex items-center space-x-2 hover:text-white">
            <MusicNoteIcon className="w-5 h-5 text-yellow-500" />
            <p>Favorite Albums</p>
          </button>
        </Link>
        <Link href="/collection/podcasts">
          <button className="flex items-center space-x-2 hover:text-white">
            <RssIcon className="w-5 h-5 text-green-500" />
            <p>Your Podcasts</p>
          </button>
        </Link>
        <hr className="border-t-[0.1px] border-gray-900" />
        <Link href="/statistics">
          <button className="flex items-center space-x-2 hover:text-white">
            <ChartBarIcon className="w-5 h-5 text-white" />
            <p>Statistics</p>
          </button>
        </Link>
        <hr className="border-t-[0.1px] border-gray-900" />

        {allPlaylists.map((playlist) => (
          <Link href={`/playlist/${playlist.id}`} key={playlist.id}>
            <a className="block cursor-pointer hover:text-white">
              {playlist.name}
            </a>
          </Link>
        ))}
      </div>
      <CreatePlaylistModal />
    </div>
  );
}
