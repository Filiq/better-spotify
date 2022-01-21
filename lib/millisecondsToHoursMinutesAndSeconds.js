export default function millisecondsToHoursMinutesAndSeconds(ms) {
  const seconds = ((ms / 1000) % 60).toFixed(0);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  const formattedTime =
    `${hours < 1 ? "" : hours.toString() + ":"}` +
    `${
      minutes === 0 && hours === 0
        ? "0:"
        : minutes === 0 && hours !== 0
        ? "00:"
        : minutes < 10 && hours !== 0
        ? "0" + minutes.toString() + ":"
        : minutes.toString() + ":"
    }` +
    `${
      seconds === 0
        ? "00"
        : seconds < 10
        ? "0" + seconds.toString()
        : seconds.toString()
    }`;

  return formattedTime;
}
