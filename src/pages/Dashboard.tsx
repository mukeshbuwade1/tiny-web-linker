import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Meta from "@/components/Meta";
import { 
  BarChart2, 
  Link as LinkIcon, 
  QrCode, 
  Plus, 
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, profile, session } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="Dashboard | URL Shortener"
        description="Manage your shortened URLs, generate QR codes, and view analytics."
      />
      
      <div className="container mx-auto px-4">
        <Header />
        
        <main className="py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.name || user?.email}
              </p>
            </div>
            
            <Link to="/">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Short URL
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5 text-primary" />
                  My Links
                </CardTitle>
                <CardDescription>
                  Manage your shortened URLs
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-3xl font-bold">
                  0
                </p>
                <p className="text-sm text-muted-foreground">
                  Total links created
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/user-links" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Links
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  Track your links performance
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-3xl font-bold">
                  0
                </p>
                <p className="text-sm text-muted-foreground">
                  Total link clicks
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/analytics" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Analytics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <QrCode className="mr-2 h-5 w-5 text-primary" />
                  QR Codes
                </CardTitle>
                <CardDescription>
                  Generate QR codes for your links
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-3xl font-bold">
                  0
                </p>
                <p className="text-sm text-muted-foreground">
                  QR codes generated
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/qr-code" className="w-full">
                  <Button variant="outline" className="w-full">
                    Generate QR Code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a New Short URL</CardTitle>
              <CardDescription>
                Paste a long URL to create a shorter, more manageable link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  type="url" 
                  placeholder="https://example.com/very-long-url-that-needs-shortening" 
                  className="flex-1"
                  value=""
                  onChange={() => {}}
                />
                <Button onClick={() => {
                  toast.info("Redirecting to home page to create a new link");
                  navigate("/");
                }}>
                  Shorten URL
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Links</CardTitle>
              <CardDescription>
                Your most recently created short URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="mx-auto h-12 w-12 opacity-20 mb-3" />
                <p>You haven't created any links yet</p>
                <p className="text-sm">Create your first short URL to see it here</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/user-links")}>
                View All Links
              </Button>
              <Button onClick={() => navigate("/")}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Link
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
