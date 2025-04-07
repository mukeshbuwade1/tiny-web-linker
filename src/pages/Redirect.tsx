
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Redirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        // This would call your Supabase Edge Function once it's set up
        const response = await fetch(`/api/redirect/${shortCode}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Short link not found");
          }
          throw new Error("Failed to fetch original URL");
        }
        
        const data = await response.json();
        window.location.href = data.originalUrl;
      } catch (error) {
        console.error("Error redirecting:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    };
    
    if (shortCode) {
      fetchOriginalUrl();
    }
  }, [shortCode]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a href="/" className="text-primary hover:underline">
            Go back to homepage
          </a>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting you to your destination...</p>
        </div>
      )}
    </div>
  );
};

export default Redirect;
