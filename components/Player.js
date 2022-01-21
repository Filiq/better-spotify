import useSpotify from "../hooks/useSpotify";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { useCallback, useEffect, useState } from "react";
import PlayerButtons from "./PlayerButtons";

export default function Player() {
  const spotifyApi = useSpotify();
  const [volume, setVolume] = useState(50);

  const getOAuthToken = useCallback(
    (callback) => callback(spotifyApi.getAccessToken()),
    [spotifyApi.getAccessToken()]
  );

  useEffect(() => {
    setVolume(localStorage.getItem("better_spotify_volume") || 50);
  }, []);

  return (
    <WebPlaybackSDK
      deviceName="Better Spotify"
      getOAuthToken={getOAuthToken}
      volume={volume / 100}
      connectOnInitialized={true}
      playbackStateAutoUpdate={true}
      playbackStateUpdateDuration_ms={500}
    >
      <PlayerButtons volume={volume} setVolume={setVolume} />
    </WebPlaybackSDK>
  );
}
