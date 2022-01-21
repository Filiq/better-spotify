import Link from "next/link";

export default function Playlist({ order, playlist }) {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <div className="flex justify-between px-5 py-4 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-900">
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          <img
            src={
              playlist?.images[0]?.url
                ? playlist.images[0].url
                : "/album-default.png"
            }
            alt=""
            className="object-cover w-10 h-10"
          />
          <div>
            <p className="text-white truncate w-36 lg:w-64">{playlist?.name}</p>
            <p className="hidden text-xs lg:text-sm md:inline xl:text-base">
              {playlist?.description.length > 360
                ? playlist?.description.substring(0, 360).replace(/\s*$/, "") +
                  "..."
                : playlist?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end ml-auto w-[30rem] md:ml-0">
          <p>
            {playlist?.tracks?.length &&
              `${playlist?.tracks?.length} track${
                playlist?.tracks?.length !== 1 ? "s" : ""
              }`}
          </p>
        </div>
      </div>
    </Link>
  );
}
