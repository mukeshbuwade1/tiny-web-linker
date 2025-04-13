
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { session } = useAuth();

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const shortenUrl = async () => {
    setErrorMessage("");
    
    if (!url.trim()) {
      setErrorMessage("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      setErrorMessage("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsLoading(true);
    try {
      // Add https:// if missing
      // let processedUrl = url;
      // if (!url.startsWith('http://') && !url.startsWith('https://')) {
      //   processedUrl = 'https://' + url;
      // }

      // Call the Supabase Edge Function with authentication if available
      const options: any = {
        body: { url },
      };
      
      // Add auth header if user is logged in
      if (session) {
        options.headers = {
          Authorization: `Bearer ${session.access_token}`,
        };
      }

      const { data, error } = await supabase.functions.invoke("short-url-generator", options);

      if (error) {
        throw new Error(error.message || "Failed to shorten URL");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setShortUrl(data.shortUrl);
      toast.success("URL shortened successfully!");
    } catch (error) {
      console.error("Error shortening URL:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error shortening URL. Please try again.");
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-gray-700">
            Enter a long URL
          </label>
          <div className="flex space-x-2">
            <Input
              id="url"
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow"
              onKeyDown={(e) => e.key === "Enter" && shortenUrl()}
            />
            <Button onClick={shortenUrl} disabled={isLoading}>
              {isLoading ? "Shortening..." : "Shorten"}
            </Button>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        {shortUrl && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="mr-2 overflow-hidden">
                  <p className="text-sm text-muted-foreground">Your shortened URL:</p>
                  <p className="font-medium truncate text-primary">{shortUrl}</p>
                </div>
                <Button size="icon" variant="outline" onClick={copyToClipboard} aria-label="Copy to clipboard">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
