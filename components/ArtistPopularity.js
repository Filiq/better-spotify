import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ArtistPopularity({ score }) {
  return (
    <div className="flex flex-wrap w-48 px-8 my-2 text-white">
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          strokeLinecap: "butt",
          pathTransitionDuration: 1.5,
          pathColor: "#1dB954",
          textColor: "#1dB954",
          trailColor: "#ffffff",
        })}
      />
    </div>
  );
}
