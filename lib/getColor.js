import { shuffle } from "lodash";

export default function getColor() {
  const colorsBg = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
  ];

  const colorsFrom = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
  ];

  return { bg: shuffle(colorsBg).pop(), from: shuffle(colorsFrom).pop() };
}
