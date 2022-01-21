import spotifyApi from "./spotify";

export default async function getMyDevices({ token }) {
  spotifyApi.setAccessToken(token);

  try {
    let myDevicesData = (await spotifyApi.getMyDevices()).body;

    return myDevicesData;
  } catch (err) {
    return null;
  }
}
