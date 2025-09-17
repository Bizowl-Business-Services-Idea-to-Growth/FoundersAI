import React, { useEffect, useState } from "react";

function useRoadmap(userId: string) {
  const [roadmap, setRoadmap] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchRoadmap() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/generate-roadmap/${userId}`);
        if (!res.ok) throw new Error("Failed to get roadmap");
        const data = await res.json();
        setRoadmap(data.roadmap);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    }

    fetchRoadmap();
  }, [userId]);

  return { roadmap, loading, error };
}
