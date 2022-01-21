import {
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isPlayingState, trackIdState } from "../atoms/trackAtom";
import useSpotify from "../hooks/useSpotify";
import millisecondsToHoursMinutesAndSeconds from "../lib/millisecondsToHoursMinutesAndSeconds";
import PlayerBar from "./PlayerBar";
import DeviceSettings from "./DeviceSettings";

export default function PlayerButtons({ volume, setVolume }) {
  const player = useSpotifyPlayer();
  const playbackState = usePlaybackState(true, 100);
  const playerDevice = usePlayerDevice();
  const spotifyApi = useSpotify();

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [trackId, setTrackId] = useRecoilState(trackIdState);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");
  const [time, setTime] = useState(playbackState?.position || 0);
  const [devices, setDevices] = useState([]);
  const [deviceIconClicked, setDeviceIconClicked] = useState(false);

  useEffect(() => {
    if (!playerDevice?.device_id) return;

    spotifyApi.transferMyPlayback([playerDevice.device_id]);
  }, [playerDevice]);

  useEffect(() => {
    setDeviceIconClicked(false);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyDevices()
        .then((data) => {
          setDevices(data.body.devices);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (!playbackState) return;

    setTrackId(playbackState?.track_window?.current_track?.id);
    setIsPlaying(!playbackState.paused);
  }, [playbackState, deviceIconClicked]);

  const handleRepeat = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      spotifyApi.setRepeat(
        data.body.repeat_state === "off"
          ? "context"
          : data.body.repeat_state === "context"
          ? "track"
          : "off"
      );
      setRepeat(
        data.body.repeat_state === "off"
          ? "context"
          : data.body.repeat_state === "context"
          ? "track"
          : "off"
      );
    });
  };

  const handleShuffle = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      spotifyApi.setShuffle(!data.body.shuffle_state);
      setShuffle(!data.body.shuffle_state);
    });
  };

  return (
    <>
      {!playbackState ? (
        <div className="flex flex-col px-2 py-2 text-xs text-white h-36 md:h-24 md:grid md:grid-cols-3 bg-gradient-to-b from-black to-gray-900 md:text-base md:px-8 md:py-0">
          <div className="flex items-center space-x-4 opacity-50">
            <img
              className="inline object-cover w-10 h-10"
              src="/album-default.png"
              alt=""
            />
            <div>
              <h3>Track</h3>
              <p>Artists</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center opacity-50 justify-evenly">
              <SwitchHorizontalIcon className="w-5 h-5 text-white" />
              <RewindIcon className="w-5 h-5" />
              <PlayIcon className="w-10 h-10" />

              <FastForwardIcon className="w-5 h-5" />
              <div className="relative">
                <ReplyIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center opacity-50">
              <div>
                <p className="text-sm select-none">0:00</p>
              </div>
              <div className="relative w-full mx-4">
                <div className="absolute w-full h-1 bg-gray-700"></div>
              </div>
              <div>
                <p className="text-sm select-none">0:00</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pr-5 md:justify-end">
            <DeviceSettings
              devices={devices}
              setDeviceIconClicked={setDeviceIconClicked}
            />
            <div className="flex space-x-3 md:space-x-4">
              <VolumeDownIcon className="w-5 h-5 opacity-50" />
              <input
                className="opacity-50 w-14 md:w-28"
                type="range"
                min="0"
                max="100"
                value={0}
                disabled={true}
              />
              <VolumeUpIcon className="w-5 h-5 opacity-50" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col px-2 py-2 text-xs text-white h-36 md:h-24 md:grid md:grid-cols-3 bg-gradient-to-b from-black to-gray-900 md:text-base md:px-8 md:py-0">
          <div className="flex items-center space-x-4">
            <img
              className="inline object-cover w-10 h-10"
              src={
                playbackState.track_window.current_track?.album?.images?.[0]
                  ?.url
                  ? playbackState.track_window.current_track.album.images[0].url
                  : "/album-default.png"
              }
              alt=""
            />
            <div>
              <h3>{playbackState.track_window.current_track?.name}</h3>
              <p>
                {playbackState.track_window.current_track?.artists?.[0]?.name}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-evenly">
              <SwitchHorizontalIcon
                className={`button ${
                  shuffle ? "text-green-500" : "text-white"
                }`}
                onClick={handleShuffle}
              />
              <RewindIcon
                className="button"
                onClick={() => {
                  player.previousTrack();
                }}
              />
              {isPlaying ? (
                <PauseIcon
                  className="w-10 h-10 button"
                  onClick={() => {
                    player.pause();
                  }}
                />
              ) : (
                <PlayIcon
                  className="w-10 h-10 button"
                  onClick={() => {
                    player.resume();
                  }}
                />
              )}
              <FastForwardIcon
                className="button"
                onClick={() => {
                  player.nextTrack();
                }}
              />
              <div className="relative">
                <ReplyIcon
                  className={`button ${
                    repeat === "off" ? "text-white" : "text-green-500"
                  }`}
                  onClick={handleRepeat}
                />
                {repeat === "track" && (
                  <div
                    className="absolute flex items-center justify-center w-3 h-3 text-xs text-black bg-green-500 rounded-full right-[-0.2rem] top-[-0.2rem] cursor-pointer"
                    onClick={handleRepeat}
                  >
                    1
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <p className="text-sm select-none">
                  {millisecondsToHoursMinutesAndSeconds(time)}
                </p>
              </div>
              <PlayerBar time={time} setTime={setTime} />
              <div>
                <p className="text-sm select-none">
                  {millisecondsToHoursMinutesAndSeconds(playbackState.duration)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pr-5 md:justify-end">
            <DeviceSettings
              devices={devices}
              setDeviceIconClicked={setDeviceIconClicked}
            />
            <div className="flex space-x-3 md:space-x-4">
              <VolumeDownIcon
                onClick={() =>
                  volume >= 10 ? setVolume(volume - 10) : setVolume(0)
                }
                className="button"
              />
              <input
                className="w-28"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  localStorage.setItem(
                    "better_spotify_volume",
                    Number(e.target.value)
                  );
                }}
              />
              <VolumeUpIcon
                className="button"
                onClick={() =>
                  volume <= 90 ? setVolume(volume + 10) : setVolume(100)
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
