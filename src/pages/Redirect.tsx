
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Redirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        if (!shortCode) {
          throw new Error("Short code is required");
        }
        
        // Query the database for the original URL
        const { data, error } = await supabase
          .from('short_urls')
          .select('original_url, id, clicks')
          .eq('short_code', shortCode)
          .maybeSingle();
        
        if (error) {
          throw new Error("Failed to fetch original URL");
        }
        
        if (!data) {
          throw new Error("Short link not found");
        }
        
        // Update click count by incrementing the current value
        const currentClicks = data.clicks || 0;
        await supabase
          .from('short_urls')
          .update({ clicks: currentClicks + 1 })
          .eq('id', data.id);
        
        // Redirect to the original URL
        window.location.href = data.original_url;
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
