import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import SpotifyImage from "../public/spotify.png";

export default function Login({ providers }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black">
      <Image
        src={SpotifyImage}
        width={208}
        height={208}
        alt="spotify"
        className="object-cover mb-5 w-52"
      />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-3xl"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
