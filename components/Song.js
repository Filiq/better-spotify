import { useRecoilState } from "recoil";
import { isPlayingState, trackIdState } from "../atoms/trackAtom";
import useSpotify from "../hooks/useSpotify";
import millisecondsToHoursMinutesAndSeconds from "../lib/millisecondsToHoursMinutesAndSeconds";
import { toast } from "react-toastify";
import SongSettings from "./SongSettings";
import { useState, useRef } from "react";
import { VolumeUpIcon, PlayIcon, HeartIcon } from "@heroicons/react/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function Song({ order, track, albumImage, playlist_id }) {
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [trackId, setTrackId] = useRecoilState(trackIdState);
  const [isHover, setIsHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [liked, setLiked] = useState(track?.liked || false);
  const trackRef = useRef();

  const playSong = () => {
    spotifyApi
      .play({
        uris: [track.uri],
      })
      .then(() => {
        setIsPlaying(true);
        setTrackId(track.id);
      })
      .catch((err) => {
        if (err.message.includes("NO_ACTIVE_DEVICE")) {
          toast.error(
            "No active device, please turn on any device with Spotify"
          );
        }
      });
  };

  const likeTheTrack = () => {
    if (liked) {
      spotifyApi.removeFromMySavedTracks([track.id]);
    } else {
      spotifyApi.addToMySavedTracks([track.id]);
    }

    setLiked(!liked);
  };

  return (
    <div
      className={`grid grid-cols-2 px-5 py-4 ${
        isHover || trackId === track.id ? "bg-gray-900" : ""
      }  text-gray-500 rounded-lg cursor-pointer`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => {
        !btnHover && playSong();
      }}
      ref={trackRef}
    >
      <div className="flex items-center space-x-4">
        {isHover && trackId !== track.id ? (
          <div className="relative w-10 h-10">
            <div className="absolute z-0 bg-white rounded-full w-7 h-7 top-[0.3rem] left-[0.3rem]"></div>
            <PlayIcon className="relative w-10 h-10 text-gray-900 z-1" />
          </div>
        ) : trackId === track.id && isPlaying ? (
          <div className="relative flex items-center justify-center w-10 h-10">
            <VolumeUpIcon className="relative w-5 h-5 text-white z-1" />
          </div>
        ) : (
          <p className="flex items-center justify-center min-w-[2.5rem] min-h-[2.5rem] w-10 h-10">
            {order + 1}
          </p>
        )}
        {liked ? (
          <HeartIcon
            className="button text-green-500 min-w-[1.25rem] min-h-[1.25rem]"
            onClick={likeTheTrack}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />
        ) : (
          <HeartOutlineIcon
            className="button text-white min-w-[1.25rem] min-h-[1.25rem]"
            onClick={likeTheTrack}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />
        )}

        <img
          src={
            track?.album?.images?.[0]?.url
              ? track.album.images[0].url
              : albumImage
          }
          alt=""
          className="object-cover w-10 h-10"
        />
        <div>
          <p className="text-white truncate w-36 lg:w-64">{track?.name}</p>
          <p className="w-40">
            {track?.artists?.map((artist, idx) => (
              <span key={idx}>
                <Link href={`/artist/${artist.id}`}>
                  <a
                    className="hover:text-gray-300"
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                  >
                    {artist.name}
                  </a>
                </Link>
                {idx !== track?.artists?.length - 1 && <span>, </span>}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end ml-auto lg:justify-between md:ml-0">
        <Link href={`/album/${track?.album?.id}`}>
          <a className="hidden w-40 lg:inline hover:text-gray-300">
            {track?.album?.name}
          </a>
        </Link>
        <div className="flex items-center">
          <p className="hidden sm:block">
            {millisecondsToHoursMinutesAndSeconds(track?.duration_ms)}
          </p>
          {isHover || trackId === track.id ? (
            <SongSettings
              setBtnHover={setBtnHover}
              artists={track?.artists}
              album={track?.album}
              track={track}
              liked={liked}
              likeTheTrack={likeTheTrack}
              playlist_id={playlist_id}
              trackRef={trackRef}
            />
          ) : (
            <div className="flex w-6 h-6 ml-6"></div>
          )}
        </div>
      </div>
    </div>
  );
}
