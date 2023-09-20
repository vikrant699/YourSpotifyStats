import { json } from "react-router-dom";

export const getUserTopItems = async () => {
  try {
    const cookies = document.cookie;
    const match = cookies.match(/auth_token=([^;]*)/);
    const authToken = match && match[1];

    if (authToken) {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/artists",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        return response;
      } else {
        return json({ message: "Something went wrong." }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error fetching top artists:", error);
  }
};
