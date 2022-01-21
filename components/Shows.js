import Show from "./Show";

export default function Shows({ shows }) {
  return (
    <div className="flex flex-col px-8 pb-32 space-y-1 text-white">
      {shows?.[0]?.show &&
        shows?.map(({ show }, idx) => (
          <Show key={show.id} show={show} order={idx} />
        ))}
      {!shows?.[0]?.show &&
        shows?.map((show, idx) => (
          <Show key={show.id} show={show} order={idx} />
        ))}
    </div>
  );
}
