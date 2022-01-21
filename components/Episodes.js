import Episode from "./Episode";

export default function Episodes({ show }) {
  return (
    <div className="flex flex-col px-8 pb-32 space-y-1 text-white">
      {show?.map((episode, idx) => (
        <Episode key={episode.id} episode={episode} order={idx} />
      ))}
    </div>
  );
}
