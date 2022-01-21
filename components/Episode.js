import { useRecoilState } from "recoil";
import { isPlayingState } from "../atoms/trackAtom";
import useSpotify from "../hooks/useSpotify";
import { toast } from "react-toastify";
import millisecondsToHoursMinutesAndSeconds from "../lib/millisecondsToHoursMinutesAndSeconds";

export default function Episode({ order, episode }) {
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playEpisode = () => {
    spotifyApi
      .play({
        uris: [episode.uri],
      })
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        if (err.message.includes("NO_ACTIVE_DEVICE")) {
          toast.error(
            "No active device, please turn on any device with Spotify"
          );
        }
        if (err.message.includes("Unsupported uri kind: show")) {
          toast.error(
            "Episode playback is not currently supported by the Spotify API"
          );
        }
      });
  };

  return (
    <div
      className="flex justify-between px-5 py-4 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-900"
      onClick={playEpisode}
    >
      <div className="flex items-center space-x-4">
        <img
          src={
            episode?.images?.[0]?.url
              ? episode.images[0].url
              : "/album-default.png"
          }
          alt=""
          className="object-cover w-10 h-10"
        />
        <div>
          <p className="text-white truncate w-36 lg:w-64">{episode?.name}</p>
          <p className="hidden text-xs lg:text-sm md:inline xl:text-base">
            {episode?.description.length > 360
              ? episode?.description.substring(0, 360).replace(/\s*$/, "") +
                "..."
              : episode?.description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end ml-auto w-[30rem] md:ml-0">
        <p>{millisecondsToHoursMinutesAndSeconds(episode?.duration_ms)}</p>
      </div>
    </div>
  );
}
