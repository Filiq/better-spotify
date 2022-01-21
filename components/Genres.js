import Genre from "./Genre";

export default function Genres({ genres }) {
  return (
    <div className="flex flex-wrap px-8 pb-4 -ml-2 text-white">
      {genres?.map((genre, idx) => (
        <Genre key={idx} genre={genre} order={idx + 1} />
      ))}
    </div>
  );
}
