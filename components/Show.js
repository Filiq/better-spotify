import Link from "next/link";

export default function Show({ order, show }) {
  return (
    <Link href={`/show/${show.id}`}>
      <div className="flex justify-between px-5 py-4 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-900">
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          <img
            src={
              show?.images[0]?.url ? show.images[0].url : "/album-default.png"
            }
            alt=""
            className="object-cover w-10 h-10"
          />
          <div>
            <p className="text-white truncate w-36 lg:w-64">{show?.name}</p>
            <p className="hidden text-xs lg:text-sm md:inline xl:text-base">
              {show?.description.length > 360
                ? show?.description.substring(0, 360).replace(/\s*$/, "") +
                  "..."
                : show?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end ml-auto w-[30rem] md:ml-0">
          <p>
            {show?.total_episodes &&
              `${show?.total_episodes} episode${
                show?.total_episodes !== 1 ? "s" : ""
              }`}
          </p>
        </div>
      </div>
    </Link>
  );
}
