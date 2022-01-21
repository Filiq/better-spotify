import { PauseIcon, HeartIcon, PlayIcon } from "@heroicons/react/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/outline";
import { isPlayingState } from "../atoms/trackAtom";
import { useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import PlaylistSettings from "./PlaylistSettings";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PlaylistHeader({
  playlist,
  user_id,
  isUserFollowingPlaylist,
}) {
  const isPlaying = useRecoilValue(isPlayingState);
  const [isFollowing, setIsFollowing] = useState(isUserFollowingPlaylist);
  const spotifyApi = useSpotify();

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body.is_playing) {
          spotifyApi.pause();
        } else {
          spotifyApi.play();
        }
      })
      .catch((err) => {
        toast.error("No active device, please turn on any device with Spotify");
      });
  };

  const removePlaylistFromLibrary = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .unfollowPlaylist(playlist.id)
        .then((data) => {
          setIsFollowing(false);
        })
        .catch((err) => console.error(err));
    }
  };

  const addPlaylistToLibrary = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .followPlaylist(playlist.id)
        .then((data) => {
          setIsFollowing(true);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="flex items-center h-16 px-8 space-x-4 bg-black">
      <div className="relative w-16 h-16">
        <div className="absolute z-0 w-12 h-12 bg-white rounded-full top-2 left-2"></div>
        {isPlaying ? (
          <PauseIcon
            className="w-16 h-16 text-green-500 button z-1"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayIcon
            className="w-16 h-16 text-green-500 button z-1"
            onClick={handlePlayPause}
          />
        )}
      </div>
      {playlist?.owner?.id !== user_id && isFollowing && (
        <HeartIcon
          className="w-10 h-10 text-green-500 button"
          onClick={removePlaylistFromLibrary}
        />
      )}
      {playlist?.owner?.id !== user_id && !isFollowing && (
        <HeartOutlineIcon
          className="w-10 h-10 text-green-500 button"
          onClick={addPlaylistToLibrary}
        />
      )}
      <PlaylistSettings
        playlist={playlist}
        user_id={user_id}
        isFollowing={isFollowing}
        removePlaylistFromLibrary={removePlaylistFromLibrary}
        addPlaylistToLibrary={addPlaylistToLibrary}
      />
    </div>
  );
}
