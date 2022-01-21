import Album from "./Album";

export default function Albums({ albums }) {
  return (
    <div className="flex flex-col px-8 pb-32 space-y-1 text-white">
      {albums?.[0]?.album &&
        albums?.map(({ album }, idx) => (
          <Album key={album.id} album={album} order={idx} />
        ))}
      {!albums?.[0]?.album &&
        albums?.map((album, idx) => (
          <Album key={album.id} album={album} order={idx} />
        ))}
    </div>
  );
}
