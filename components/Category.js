import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import Link from "next/link";

export default function Category({ category }) {
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
    <Link href={`/genre/${category?.id}`}>
      <div
        className={`h-40 w-40 ${color}  rounded-lg m-2 relative cursor-pointer`}
      >
        <img src={category?.icons?.[0]?.url} alt="" className="absolute" />
        <p
          className={`absolute z-10 ${
            category?.name.length >= 20 ? "text-xs" : "text-base"
          } font-semibold -translate-x-1/2 left-1/2 top-2/3 text-center`}
        >
          {category?.name}
        </p>
      </div>
    </Link>
  );
}
