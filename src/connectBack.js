import { useState, useEffect } from "react";

const useFetchUser = (name) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/api/trainers/" + name
        );
        const contentType = response.headers.get("content-type");
        if (
          response.ok &&
          contentType &&
          contentType.includes("application/json")
        ) {
          const data = await response.json();
          setUser(data);
        } else {
          setError("Failed to fetch user: Not a JSON response");
        }
      } catch (error) {
        setError("Failed to fetch user: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [name]);

  return { user, error, isLoading };
};

export default useFetchUser;
