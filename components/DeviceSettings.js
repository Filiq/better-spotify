import { Menu, Transition } from "@headlessui/react";
import { DesktopComputerIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import useSpotify from "../hooks/useSpotify";

export default function DeviceSettings({ devices, setDeviceIconClicked }) {
  const spotifyApi = useSpotify();

  const transferPlaybackDevice = (id) => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.transferMyPlayback([id]).catch((err) => {
        if (err.message.includes("Device not found")) {
          toast.error("Device not found");
        }
      });
    }
  };

  return (
    <Menu as="div" className="relative inline-block mb-1 text-left md:mr-4">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="flex items-center p-1 mt-1 ml-4 space-x-3 text-white rounded-full cursor-pointer opacity-90 hover:opacity-80">
              <DesktopComputerIcon
                className="button"
                onClick={() => {
                  if (!open) {
                    setDeviceIconClicked(true);
                  }
                }}
              />
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
            <Menu.Items className="absolute left-0 z-10 w-56 origin-top-right bg-gray-800 divide-y divide-gray-100 rounded-md shadow-lg md:right-0 bottom-8 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1">
                <div className="flex flex-col items-center h-32">
                  <h2 className="mt-1 font-semibold">Connect to a device</h2>
                  <img src="/devices.png" className="mt-4 w-28" />
                </div>
                <hr className="border-t-[0.1px] border-gray-700" />
                {devices?.map((device, idx) => (
                  <Menu.Item key={idx}>
                    <button
                      className={`flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-700 group ${
                        device.is_active ? "text-green-500" : "text-white"
                      }`}
                      onClick={() => transferPlaybackDevice(device.id)}
                    >
                      {device.name}
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
