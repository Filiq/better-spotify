import Playlist from "./Playlist";

export default function Playlists({ playlists }) {
  return (
    <div className="flex flex-col px-8 pb-32 space-y-1 text-white">
      {playlists?.map((playlist, idx) => (
        <Playlist key={playlist.id} playlist={playlist} order={idx} />
      ))}
    </div>
  );
}
