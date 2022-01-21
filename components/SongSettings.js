import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import Link from "next/link";
import MoreArtistsOption from "./MoreArtistsOption";
import { useState } from "react";
import AddToPlaylistOption from "./AddToPlaylistOption";
import { useRecoilValue } from "recoil";
import { myPlaylistsState } from "../atoms/playlistsAtom";
import useSpotify from "../hooks/useSpotify";

export default function SongSettings({
  track,
  setBtnHover,
  artists,
  album,
  liked,
  likeTheTrack,
  playlist_id,
  trackRef,
}) {
  const shareTheLink = (e) => {
    navigator.clipboard.writeText(`https://open.spotify.com/track/${track.id}`);
    toast.info("Link copied to clipboard");
  };

  const [moreArtistsHover, setMoreArtistsHover] = useState(false);
  const [playlistsHover, setPlaylistsHover] = useState(false);
  const playlists = useRecoilValue(myPlaylistsState);
  const spotifyApi = useSpotify();

  const removeFromPlaylist = () => {
    spotifyApi
      .removeTracksFromPlaylist(playlist_id, [{ uri: track.uri }])
      .then((data) => {
        trackRef.current.classList.remove("grid");
        trackRef.current.classList.add("hidden");
        toast.success("Track has been successfully removed from this playlist");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Menu
      as="div"
      className="relative inline-block text-left"
      onMouseEnter={() => setBtnHover(true)}
      onMouseLeave={() => setBtnHover(false)}
    >
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="flex items-center p-1 mt-1 ml-4 space-x-3 text-white rounded-full cursor-pointer opacity-90 hover:opacity-80">
              <DotsHorizontalIcon className="w-6 h-6 text-gray-400 button" />
            </Menu.Button>
          </div>
          <Transition
            as="div"
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-gray-800 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1">
                {artists.length < 2 && (
                  <Menu.Item>
                    <Link href={`/artist/${artists?.[0]?.id}`}>
                      <button
                        className="flex items-center w-full p-2 text-sm text-white rounded-md hover:bg-gray-700 group"
                        onMouseEnter={() => {
                          setPlaylistsHover(false);
                        }}
                      >
                        Go to artist
                      </button>
                    </Link>
                  </Menu.Item>
                )}
                {artists.length > 1 && (
                  <Menu.Item>
                    <MoreArtistsOption
                      artists={artists}
                      moreArtistsHover={moreArtistsHover}
                      setMoreArtistsHover={setMoreArtistsHover}
                      setPlaylistsHover={setPlaylistsHover}
                    />
                  </Menu.Item>
                )}
                <Menu.Item>
                  <Link href={`/album/${album.id}`}>
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-700 group"
                      onMouseEnter={() => {
                        setMoreArtistsHover(false);
                        setPlaylistsHover(false);
                      }}
                    >
                      Go to album
                    </button>
                  </Link>
                </Menu.Item>
                <hr className="border-t-[0.1px] border-gray-700" />
                <Menu.Item>
                  <button
                    className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-700 group"
                    onMouseEnter={() => {
                      setMoreArtistsHover(false);
                      setPlaylistsHover(false);
                    }}
                    onClick={likeTheTrack}
                  >
                    {liked
                      ? "Remove from your Liked Songs"
                      : "Save to your Liked Songs"}
                  </button>
                </Menu.Item>
                {playlists.length > 0 && (
                  <Menu.Item>
                    <AddToPlaylistOption
                      playlistsHover={playlistsHover}
                      setMoreArtistsHover={setMoreArtistsHover}
                      setPlaylistsHover={setPlaylistsHover}
                      track={track}
                    />
                  </Menu.Item>
                )}
                {playlists
                  .map((playlist) => playlist.id)
                  .indexOf(playlist_id) !== -1 && (
                  <>
                    <hr className="border-t-[0.1px] border-gray-700" />
                    <Menu.Item>
                      <button
                        className="flex items-center w-full p-2 text-sm text-white rounded-md hover:bg-gray-700 group"
                        onMouseEnter={() => {
                          setPlaylistsHover(false);
                          setMoreArtistsHover(false);
                        }}
                        onClick={removeFromPlaylist}
                      >
                        Remove from this Playlist
                      </button>
                    </Menu.Item>
                  </>
                )}
                <hr className="border-t-[0.1px] border-gray-700" />
                <Menu.Item>
                  <button
                    className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-700 group"
                    onClick={shareTheLink}
                    onMouseEnter={() => {
                      setMoreArtistsHover(false);
                      setPlaylistsHover(false);
                    }}
                  >
                    Share
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
