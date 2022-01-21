import { Menu, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { myPlaylistsState } from "../atoms/playlistsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import getPlaylist from "../lib/getPlaylist";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { duplicatedSongModalState } from "../atoms/duplicatedSongModalAtom";

export default function AddToPlaylistOption({
  playlistsHover,
  setPlaylistsHover,
  setMoreArtistsHover,
  track,
}) {
  const playlists = useRecoilValue(myPlaylistsState);
  const [duplicatedModal, setDuplicatedModal] = useRecoilState(
    duplicatedSongModalState
  );
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const addToPlaylist = async (id) => {
    const {
      tracks: { items },
    } = await getPlaylist({ id, token: session.user.accessToken });

    const trackIds = items.map((item) => item.track.id);

    if (trackIds.indexOf(track.id) !== -1) {
      setDuplicatedModal({ open: true, playlist_id: id, track_uri: track.uri });
    } else {
      spotifyApi
        .addTracksToPlaylist(id, [track.uri])
        .then((data) => {
          toast.success("Track has been succesully added to the playlist");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Menu
      as="div"
      className="relative inline-block w-full text-left"
      onMouseEnter={() => {
        setPlaylistsHover(true);
        setMoreArtistsHover(false);
      }}
    >
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="flex items-center justify-between w-full p-2 text-sm text-white rounded-md hover:bg-gray-700 group">
              Add to Playlist
              <ChevronRightIcon className="w-5 h-5" />
            </Menu.Button>
          </div>
          <Transition as="div" show={playlistsHover}>
            <Menu.Items className="absolute top-0 z-10 w-56 origin-top-right bg-gray-700 divide-y divide-gray-100 rounded-md shadow-lg right-full ring-1 ring-black ring-opacity-5 focus:outline-none ">
              <div className="p-1">
                {playlists?.map((playlist, idx) => (
                  <Menu.Item key={idx}>
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-600 group"
                      onClick={() => addToPlaylist(playlist.id)}
                    >
                      {playlist.name}
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
