import Artist from "./Artist";

export default function Artists({ artists }) {
  return (
    <div className="flex flex-col px-8 pb-32 space-y-1 text-white">
      {artists?.map((artist, idx) => (
        <Artist key={artist.id} artist={artist} order={idx} />
      ))}
    </div>
  );
}
