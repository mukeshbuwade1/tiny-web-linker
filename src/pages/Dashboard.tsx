import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check, ExternalLink } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentUrls, setRecentUrls] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentUrls();
    }
  }, [user]);

  const fetchRecentUrls = async () => {
    setIsLoadingRecent(true);
    try {
      const { data, error } = await supabase
        .from("short_urls")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentUrls(data || []);
    } catch (error) {
      console.error("Error fetching recent URLs:", error);
      toast({
        title: "Error",
        description: "Failed to load your recent URLs.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const shortenUrl = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("short-url-generator", {
        body: { url, userId: user?.id },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setShortUrl(data.shortUrl);
      toast({
        title: "Success!",
        description: "Your URL has been shortened.",
      });

      // Refresh the recent URLs list
      if (user) {
        fetchRecentUrls();
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to shorten URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Add Environment Management link */}
          <Link 
            to="/env-management" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Environment Settings
          </Link>
          
          <Link 
            to="/analytics" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            View Analytics
          </Link>
          
          <Link 
            to="/user-links" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md hover:bg-primary/90"
          >
            My Links
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Shorten a URL</CardTitle>
            <CardDescription>
              Create a short link that's easy to share and remember.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Enter a long URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    placeholder="https://example.com/very/long/url/that/is/hard/to/share"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button onClick={shortenUrl} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Shortening
                      </>
                    ) : (
                      "Shorten"
                    )}
                  </Button>
                </div>
              </div>

              {shortUrl && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-sm text-muted-foreground">Your shortened URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={shortUrl} readOnly />
                    <Button size="icon" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Tools and features to help you manage your links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link to="/qr-code">
                <Button className="w-full justify-start" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                  Generate QR Code
                </Button>
              </Link>
              <Link to="/user-links">
                <Button className="w-full justify-start" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    <path d="m15 5 3 3" />
                  </svg>
                  Manage All Links
                </Button>
              </Link>
              <Link to="/analytics">
                <Button className="w-full justify-start" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {user && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Links</CardTitle>
            <CardDescription>
              Your most recently created short links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentUrls.length > 0 ? (
              <div className="space-y-4">
                {recentUrls.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.original_url}
                      </p>
                      <a
                        href={`/${item.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm flex items-center hover:underline"
                      >
                        {window.location.host}/{item.short_code}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {item.clicks || 0} clicks
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Link to="/user-links">
                    <Button variant="link" className="text-sm">
                      View all links
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                You haven't created any links yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
