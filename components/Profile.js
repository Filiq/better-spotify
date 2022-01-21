import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div className="absolute top-5 right-8 z-50">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="flex items-center p-1 pr-2 space-x-3 text-white bg-black rounded-full cursor-pointer opacity-90 hover:opacity-80">
                <img
                  className="object-cover w-10 h-10 mr-3 rounded-full"
                  src={
                    session?.user.image ? session?.user.image : "/profile.png"
                  }
                  alt=""
                />
                {session?.user.name}
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform rotate-${
                    open ? "180" : "0"
                  }`}
                  aria-hidden="true"
                />
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
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-black divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    <a
                      href="https://www.spotify.com/account/overview/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-900 group"
                    >
                      Account
                      <ExternalLinkIcon className="w-5 h-5 text-white" />
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <Link href={`/profile`}>
                      <a className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-900 group">
                        Profile
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-white rounded-md hover:bg-gray-900 group"
                      onClick={signOut}
                    >
                      Log out
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
