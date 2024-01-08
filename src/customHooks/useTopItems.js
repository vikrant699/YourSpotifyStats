import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";

function useTopItems(apiEndpoint, isTrack) {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [followedArtists, setFollowedArtists] = useState([]);
  /* eslint-disable */
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);
  const authToken = cookies.auth_token;

  const fetchItems = useCallback(async () => {
    if (!hasMore) {
      return; // No more items to fetch, so exit
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}?limit=20&offset=${offset}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      const newItems = await data.items;

      if (!isTrack) {
        const followingResponse = await fetch(
          `https://api.spotify.com/v1/me/following?type=artist&limit=20&offset=${offset}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const followingData = await followingResponse.json();
        const followingNewItems = await followingData.artists.items.map(
          (item) => item.id
        );

        if (newItems.length !== 0) {
          setFollowedArtists([...followedArtists, ...followingNewItems]);
        }
      }

      if (newItems.length === 0) {
        setHasMore(false); // No more items to fetch
      } else {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setOffset((prevOffset) => prevOffset + 20);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [apiEndpoint, authToken, offset, items, isTrack]);

  useEffect(() => {
    fetchItems();
  }, [apiEndpoint, fetchItems]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      // User has scrolled to the bottom
      if (!loading) {
        fetchItems();
      }
    }
  }, [fetchItems, loading]);

  useEffect(() => {
    if (!hasMore || loading) {
      return;
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore, handleScroll]);

  return { items, loading, hasMore, followedArtists };
}

export default useTopItems;
