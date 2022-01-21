import formatNumber from "../lib/formatNumber";
import Link from "next/link";

export default function Artist({ order, artist }) {
  return (
    <Link href={`/artist/${artist.id}`}>
      <div className="grid grid-cols-2 px-5 py-4 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-900">
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          <img
            src={
              artist?.images[0]?.url
                ? artist.images[0].url
                : "/album-default.png"
            }
            alt=""
            className="object-cover w-10 h-10"
          />
          <div>
            <p className="text-white truncate w-36 lg:w-64">{artist?.name}</p>
          </div>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0">
          <p className="hidden w-40 md:inline">
            {artist?.genres?.map(
              (genre, idx) =>
                genre + `${idx !== artist.genres?.length - 1 ? ", " : ""}`
            )}
          </p>
          <p>
            {artist?.followers?.total &&
              `${formatNumber(artist?.followers?.total)} follower${
                artist?.followers?.total !== 1 ? "s" : ""
              }`}
          </p>
        </div>
      </div>
    </Link>
  );
}
