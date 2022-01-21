import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import { Fragment } from "react/cjs/react.production.min";
import { useRecoilState } from "recoil";
import { deletePlaylistModalState } from "../atoms/deletePlaylistModalAtom";
import { editPlaylistModalState } from "../atoms/editPlaylistModalAtom";

export default function PlaylistSettings({
  playlist,
  user_id,
  isFollowing,
  addPlaylistToLibrary,
  removePlaylistFromLibrary,
}) {
  const [openEditModal, setOpenEditModal] = useRecoilState(
    editPlaylistModalState
  );
  const [openDeleteModal, setOpenDeleteModal] = useRecoilState(
    deletePlaylistModalState
  );

  const shareTheLink = (e) => {
    navigator.clipboard.writeText(
      `https://open.spotify.com/playlist/${playlist.id}`
    );
    toast.info("Link copied to clipboard");
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="flex items-center p-1 pr-2 space-x-3 text-white bg-black rounded-full cursor-pointer opacity-90 hover:opacity-80">
              <DotsHorizontalIcon className="w-10 h-10 text-white button" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-right bg-gray-900 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                {playlist?.owner?.id === user_id && (
                  <Menu.Item>
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-800 group"
                      onClick={() => setOpenEditModal(true)}
                    >
                      Edit details
                    </button>
                  </Menu.Item>
                )}
                {playlist?.owner?.id !== user_id ? (
                  <Menu.Item>
                    {isFollowing ? (
                      <button
                        className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-800 group"
                        onClick={removePlaylistFromLibrary}
                      >
                        Remove From Library
                      </button>
                    ) : (
                      <button
                        className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-800 group"
                        onClick={addPlaylistToLibrary}
                      >
                        Add To Library
                      </button>
                    )}
                  </Menu.Item>
                ) : (
                  <Menu.Item>
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-800 group"
                      onClick={() => setOpenDeleteModal(true)}
                    >
                      Delete
                    </button>
                  </Menu.Item>
                )}
                <hr className="border-t-[0.1px] border-gray-800" />
                <Menu.Item>
                  <button
                    className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-800 group"
                    onClick={shareTheLink}
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
