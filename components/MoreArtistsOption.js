import { Menu, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function MoreArtistsOption({
  artists,
  moreArtistsHover,
  setMoreArtistsHover,
  setPlaylistsHover,
}) {
  return (
    <Menu
      as="div"
      className="relative inline-block w-full text-left"
      onMouseEnter={() => {
        setMoreArtistsHover(true);
        setPlaylistsHover(false);
      }}
    >
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="flex items-center justify-between w-full p-2 text-sm text-white rounded-md hover:bg-gray-700 group">
              Go to artists
              <ChevronRightIcon className="w-5 h-5" />
            </Menu.Button>
          </div>
          <Transition as="div" show={moreArtistsHover}>
            <Menu.Items className="absolute top-0 z-10 w-56 origin-top-right bg-gray-700 divide-y divide-gray-100 rounded-md shadow-lg right-full ring-1 ring-black ring-opacity-5 focus:outline-none ">
              <div className="p-1">
                {artists?.map((artist, idx) => (
                  <Menu.Item key={idx}>
                    <Link href={`/artist/${artist.id}`}>
                      <button className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-600 group">
                        {artist.name}
                      </button>
                    </Link>
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
