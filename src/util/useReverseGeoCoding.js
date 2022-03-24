import axios from "axios";

export async function useReverseGeoCoding(coords) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`
  );
  return response.data.display_name;
}
