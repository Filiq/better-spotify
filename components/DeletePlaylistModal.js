import { useRecoilState } from "recoil";
import { deletePlaylistModalState } from "../atoms/deletePlaylistModalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useSpotify from "../hooks/useSpotify";
import { toast } from "react-toastify";
import { XIcon } from "@heroicons/react/solid";
import router from "next/router";

export default function DeletePlaylistModal({ playlist }) {
  const [open, setOpen] = useRecoilState(deletePlaylistModalState);
  const spotifyApi = useSpotify();

  const deletePlaylist = async () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .unfollowPlaylist(playlist?.id)
        .then((data) => {
          setOpen(false);
          router.push("/");
          toast.success("Playlist has been successfully deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/*center the modal contents*/}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-middle transition-all transform bg-black rounded-lg shadow-xl sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
              <div className="absolute right-5 top-5">
                <XIcon
                  className="w-6 h-6 text-white cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-gray-100"
                    >
                      Delete Playlist
                    </Dialog.Title>
                  </div>
                </div>

                <div className="flex mt-12 space-x-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-flex justify-center w-full px-4 py-2 text-lg font-bold text-white border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-0 focus:ring-offset-0 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disable:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deletePlaylist}
                    className="inline-flex justify-center w-full px-4 py-2 text-lg font-bold text-white bg-green-700 border border-transparent rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-0 focus:ring-offset-0 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disable:bg-gray-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
