import { useEffect, useRef, useState, useCallback } from "react";
import {
  usePlaybackState,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import scale from "../lib/scale";

export default function PlayerBar({ time, setTime }) {
  const playbackState = usePlaybackState(true, 100);
  const player = useSpotifyPlayer();
  const playbarRef = useRef(null);
  const [playbarHovered, setPlaybarHovered] = useState(false);
  const [playbarBtnHold, setPlaybarBtnHold] = useState(false);

  const handlePlayerBar = (e) => {
    const bound = playbarRef.current.getBoundingClientRect();
    const position = e.clientX - bound.left + 9;

    setTime(scale(position, 0, bound.width, 0, playbackState.duration));
    player.seek(scale(position, 0, bound.width, 0, playbackState.duration));
  };

  const movePlaybarSlider = useCallback((e) => {
    try {
      const bound = playbarRef.current.getBoundingClientRect();
      const mouseX = e.clientX;

      let position = scale(mouseX, bound.left, bound.right, 0, 100);
      position = position > 100 ? 100 : position < 0 ? 0 : position;

      setTime(
        parseInt(scale(position, 0, 100, 0, playbackState.duration).toFixed(0))
      );

      player.seek(
        parseInt(scale(position, 0, 100, 0, playbackState.duration).toFixed(0))
      );

      //player.seek();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (playbarBtnHold) {
      window.addEventListener("mousemove", movePlaybarSlider);
    }
  }, [playbarBtnHold]);

  useEffect(() => {
    window.addEventListener("mouseup", () => {
      setPlaybarBtnHold(false);
      window.removeEventListener("mousemove", movePlaybarSlider);
    });
  }, [playbarBtnHold]);

  useEffect(() => {
    if (playbarBtnHold) return;

    setTime(playbackState.position);
  }, [playbackState.position]);

  return (
    <div className="relative w-full mx-4">
      <div
        className={`absolute z-10 flex items-center justify-end h-1 ${
          playbarHovered ? "bg-green-500" : "bg-gray-400"
        }`}
        style={{
          width: `${scale(time, 0, playbackState.duration, 0, 100)}%`,
        }}
        onMouseDown={() => setPlaybarBtnHold(true)}
        onMouseEnter={() => setPlaybarHovered(true)}
        onMouseLeave={() => setPlaybarHovered(false)}
      >
        <div
          className={`w-4 h-4 rounded-full bg-green-500 ${
            playbarHovered ? "bg-green-500" : "bg-gray-400"
          }`}
          onMouseDown={() => setPlaybarBtnHold(true)}
          onMouseEnter={() => setPlaybarHovered(true)}
          onMouseLeave={() => setPlaybarHovered(false)}
        ></div>
      </div>
      <div
        className="absolute w-full h-1 bg-gray-700"
        onClick={(e) => handlePlayerBar(e)}
        ref={playbarRef}
        onMouseDown={() => setPlaybarBtnHold(true)}
        onMouseEnter={() => setPlaybarHovered(true)}
        onMouseLeave={() => setPlaybarHovered(false)}
      ></div>
    </div>
  );
}
