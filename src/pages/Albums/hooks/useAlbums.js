import { useEffect, useState } from "react";
import { getUserAlbums } from "../api.js";

export function useAlbums(userId) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getUserAlbums(userId);
        if (!cancelled) setAlbums(data);
      } catch {
        if (!cancelled) setError("Failed to load albums");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { albums, setAlbums, loading, error, setError };
}
