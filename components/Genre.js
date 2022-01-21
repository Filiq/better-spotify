import capitalizeFirstLetter from "../lib/capitalizeFirstLetter";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import Link from "next/link";

export default function Genre({ genre, order }) {
  const [color, setColor] = useState("");

  useEffect(() => {
    const colorsBg = [
      "bg-indigo-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-purple-500",
    ];

    setColor(shuffle(colorsBg).pop());
  }, []);

  return (
    <>
      {typeof genre !== "string" ? (
        <Link href={`/genre/${genre[0]}`}>
          <div
            className={`h-28 w-40 ${color}  rounded-lg m-2 cursor-pointer relative`}
          >
            <p className="pt-2 pl-2 text-lg font-semibold">
              {genre[0]
                .split(" ")
                .map(
                  (word, idx, arr) =>
                    `${capitalizeFirstLetter(word)}${
                      idx === arr.length - 1 ? "" : " "
                    }`
                )}
            </p>
            <span className="absolute bottom-0 right-0 pb-2 pr-3">
              #{order}
            </span>
          </div>
        </Link>
      ) : (
        <Link href={`/genre/${genre}`}>
          <div className={`h-28 w-40 ${color}  rounded-lg m-2 cursor-pointer`}>
            <p className="pt-2 pl-2 text-lg font-semibold">
              {genre
                .split(" ")
                .map(
                  (word, idx, arr) =>
                    `${capitalizeFirstLetter(word)}${
                      idx === arr.length - 1 ? "" : " "
                    }`
                )}
            </p>
          </div>
        </Link>
      )}
    </>
  );
}
