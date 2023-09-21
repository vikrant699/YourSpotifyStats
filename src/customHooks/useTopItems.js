import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";

function useTopItems(apiEndpoint) {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

      if (newItems.length === 0) {
        setHasMore(false); // No more items to fetch
      } else {
        setItems([...items, ...newItems]);
        setOffset(offset + 20);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [offset, items]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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

  return { items, loading, hasMore };
}

export default useTopItems;
