
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Meta from "@/components/Meta";
import { 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  Trash2, 
  QrCode,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const UserLinks = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!session) {
      navigate("/auth");
    } else {
      // Fetch user links would happen here
      setIsLoading(false);
      setLinks([]); // This would be replaced with actual links data
    }
  }, [session, navigate]);

  if (!session) {
    return null; // Don't render anything while checking auth status
  }
  
  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard");
  };
  
  const handleDeleteLink = (id: string) => {
    // This would be replaced with actual delete functionality
    toast.success("Link deleted successfully");
  };

  const filteredLinks = links.filter((link: any) => 
    link?.original_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link?.short_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="My Links | URL Shortener"
        description="View and manage all your shortened URLs in one place."
      />
      
      <div className="container mx-auto px-4">
        <Header />
        
        <main className="py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Links</h1>
              <p className="text-muted-foreground">
                Manage all your shortened URLs
              </p>
            </div>
            
            <Link to="/">
              <Button>
                <LinkIcon className="mr-2 h-4 w-4" />
                Create New Link
              </Button>
            </Link>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by URL or short code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : links.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short URL</TableHead>
                    <TableHead className="hidden md:table-cell">Original URL</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link: any) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        <a 
                          href={`/${link.short_code}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          {link.short_code}
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {link.original_url}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(link.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">{link.clicks}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleCopyLink(`${window.location.origin}/${link.short_code}`)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/qr-code?url=${window.location.origin}/${link.short_code}`)}
                          >
                            <QrCode className="h-4 w-4" />
                            <span className="sr-only">QR Code</span>
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Link</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this shortened URL? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteLink(link.id)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card">
              <LinkIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Links Found</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any short URLs yet.
              </p>
              <Link to="/">
                <Button>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Create Your First Link
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserLinks;
