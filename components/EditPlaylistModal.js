import { useRecoilState } from "recoil";
import { editPlaylistModalState } from "../atoms/editPlaylistModalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect } from "react";
import useSpotify from "../hooks/useSpotify";
import { toast } from "react-toastify";
import getBase64 from "../lib/getBase64";
import { XIcon } from "@heroicons/react/solid";
import router from "next/router";

export default function EditPlaylistModal({ playlist }) {
  const [open, setOpen] = useRecoilState(editPlaylistModalState);
  const [name, setName] = useState(playlist?.name ?? "");
  const [description, setDescription] = useState(playlist?.description ?? "");
  const [publicPlaylist, setPublicPlaylist] = useState(
    playlist?.public ?? true
  );
  const [fileDependency, setFileDependency] = useState(false);
  const coverImage = useRef(null);

  const spotifyApi = useSpotify();

  useEffect(() => {
    if (!coverImage?.current?.files || coverImage?.current?.files?.length === 0)
      return;

    const allowedExtension = ["image/jpeg"];

    if (allowedExtension.indexOf(coverImage.current.files[0].type) === -1) {
      toast.error("File is not JPEG");
      coverImage.current.value = "";
    }
  }, [fileDependency]);

  const editPlaylist = async () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .changePlaylistDetails(playlist?.id, {
          name,
          description,
          public: publicPlaylist,
        })
        .then(() => {
          if (coverImage?.current?.files?.length !== 0) {
            uploadPlaylistCoverImage(playlist?.id);
          } else {
            setOpen(false);
            router.reload();
            toast.success("Playlist has been successfully edited");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const uploadPlaylistCoverImage = async (playlistId) => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .uploadCustomPlaylistCoverImage(
          playlistId,
          (await getBase64(coverImage.current.files[0]))
            .toString()
            .replace("data:image/jpeg;base64,", "")
        )
        .then(() => {
          setOpen(false);
          router.reload();
          toast.success("Playlist has been successfully edited");
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
                      Edit Playlist
                    </Dialog.Title>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="mb-2 text-gray-200">Name</h4>
                  <input
                    className="w-full border-t-0 border-b-4 border-l-0 border-r-0 border-black focus:ring-0 focus:border-green-700"
                    type="text"
                    placeholder="My cool playlist"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <h4 className="mb-2 text-gray-200">Description</h4>
                  <input
                    className="w-full border-t-0 border-b-4 border-l-0 border-r-0 border-black focus:ring-0 focus:border-green-700"
                    type="text"
                    placeholder="Give your playlist a catchy description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center mt-4">
                  <input
                    className="text-green-700 ring-0"
                    type="checkbox"
                    id="publicAlbum"
                    value={publicPlaylist}
                    onChange={() => setPublicPlaylist(!publicPlaylist)}
                    checked={publicPlaylist}
                  />
                  <label htmlFor="publicAlbum" className="ml-2 text-white">
                    Public
                  </label>
                </div>

                <div className="mt-4">
                  <h4 className="mb-2 text-gray-200">Image Cover</h4>
                  <input
                    className="block w-full text-gray-900 bg-white border-0 rounded-lg cursor-pointer"
                    type="file"
                    ref={coverImage}
                    accept="image/jpeg"
                    onChange={() => setFileDependency(!fileDependency)}
                  />
                </div>

                <div className="mt-6 sm:mt-8">
                  <button
                    onClick={editPlaylist}
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-lg font-bold text-white bg-green-700 border border-transparent rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-0 focus:ring-offset-0 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disable:bg-gray-300"
                  >
                    Edit
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
