import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { authApi } from "@/lib/redux/slices/authSlice";

interface PreviousPromptOverlayProps {
  isVisible: boolean;
}

export function PreviousPromptOverlay({
  isVisible,
}: PreviousPromptOverlayProps) {
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !isAuthenticated) return;

    const fetchUserSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await authApi.get("/suggestions/user_suggestions/");
        setSuggestions(response.data);
      } catch (err: any) {
        setError("Failed to load suggestions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSuggestions();
  }, [isAuthenticated, hasMounted]);

  if (!hasMounted) return null;

  return (
    <>
      <div
        className={`absolute sm:fixed left-0 top-20 sm:top-20 h-[85%] w-[70%] sm:w-100 bg-[#FFF396] border-8 border-[#FFF396] transform transition-transform duration-300 ease-in-out flex flex-col items-center rounded-r-3xl ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-3 md:px-6 py-3">
          <h2 className="text-xl font-playfair font-bold mb-4">
            Previous Prompts
          </h2>
          <p>This is where your previous prompt content will go.</p>
        </div>

        <div className="w-full h-[90%] overflow-y-auto px-2 md:px-4 z-40 rounded-r-xl custom-scrollbar mb-6">
          {loading && <p>Loading suggestions...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && suggestions.length === 0 && (
            <p>No suggestions yet.</p>
          )}

          {suggestions.map((suggestion: any) => (
            <div
              key={suggestion.id}
              className="flex flex-col w-full bg-white p-4 rounded-xl shadow border border-gray-300 mb-4"
            >
              <p className="text-sm text-gray-500 mb-2">
                <strong>Date:</strong>{" "}
                {new Date(suggestion.date_created).toLocaleString()}
              </p>

              <p className="mb-1">
                <strong>Price:</strong> {suggestion.prompt.price}
              </p>
              <p className="mb-1">
                <strong>Food Preference:</strong>{" "}
                {suggestion.prompt.food_preference}
              </p>
              <p className="mb-1">
                <strong>Dietary Preference:</strong>{" "}
                {suggestion.prompt.dietary_preference}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <strong>Prompt Location:</strong>{" "}
                <a
                  href={`https://www.google.com/maps?q=${suggestion.prompt.lat},${suggestion.prompt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {suggestion.prompt.lat.toFixed(5)},{" "}
                  {suggestion.prompt.lng.toFixed(5)}
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
