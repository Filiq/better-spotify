import Song from "./Song";
import DuplicatedSongModal from "./DuplicatedSongModal";

export default function Songs({ playlist: tracks, albumImage, playlist_id }) {
  return (
    <div className="flex flex-col px-4 pb-32 space-y-1 text-white sm:px-8">
      {tracks?.[0]?.track &&
        tracks?.map(({ track }, idx) => (
          <Song
            key={track.id}
            track={track}
            order={idx}
            albumImage={albumImage}
            playlist_id={playlist_id}
          />
        ))}
      {!tracks?.[0]?.track &&
        tracks?.map((track, idx) => (
          <Song
            key={track.id}
            track={track}
            order={idx}
            albumImage={albumImage}
            playlist_id={playlist_id}
          />
        ))}
      {tracks?.length === 0 && (
        <div className="flex justify-center">
          <h2 className="pt-8 text-3xl text-white">No tracks</h2>
        </div>
      )}

      <DuplicatedSongModal />
    </div>
  );
}

Songs.defaultProps = {
  albumImage: "/album-default.png",
};
