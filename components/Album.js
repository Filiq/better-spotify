import Link from "next/link";

export default function Album({ order, album }) {
  return (
    <Link href={`/album/${album.id}`}>
      <div className="flex justify-between px-5 py-4 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-900">
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          <img
            src={
              album?.images[0]?.url ? album.images[0].url : "/album-default.png"
            }
            alt=""
            className="object-cover w-10 h-10"
          />
          <div>
            <p className="text-white truncate w-36 lg:w-64">{album?.name}</p>
            <p className="hidden text-xs lg:text-sm md:inline xl:text-base">
              {album?.artists?.map(
                (artist, idx) =>
                  artist.name +
                  `${idx !== album?.artists?.length - 1 ? ", " : ""}`
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end ml-auto w-[30rem] md:ml-0">
          <p>
            {album?.total_tracks &&
              `${album?.total_tracks} track${
                album?.total_tracks !== 1 ? "s" : ""
              }`}
          </p>
        </div>
      </div>
    </Link>
  );
}
