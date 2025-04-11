
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Meta from '@/components/Meta';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Search, 
  ArrowUpDown, 
  Link2, 
  BarChart as BarChartIcon,
  ExternalLink,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface UrlData {
  id: number;
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

const Analytics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof UrlData>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Get chart data
  const getChartData = () => {
    // Get top 5 URLs by clicks
    const topUrls = [...urls]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(url => ({
        name: url.short_code,
        clicks: url.clicks
      }));

    return topUrls;
  };

  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname.length > 20 ? urlObj.pathname.substring(0, 20) + '...' : urlObj.pathname}`;
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle sort
  const handleSort = (field: keyof UrlData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get full URL
  const getFullShortUrl = (shortCode: string) => {
    return `${window.location.origin}/${shortCode}`;
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);
      try {
        // Calculate offset based on current page
        const offset = (currentPage - 1) * itemsPerPage;
        
        // Build query based on sorting and filtering
        let query = supabase
          .from('short_urls')
          .select('*', { count: 'exact' });
        
        // Apply search filter if provided
        if (searchTerm) {
          query = query.or(`original_url.ilike.%${searchTerm}%,short_code.ilike.%${searchTerm}%`);
        }
        
        // Apply sorting
        query = query.order(sortField, { ascending: sortDirection === 'asc' });
        
        // Apply pagination
        query = query.range(offset, offset + itemsPerPage - 1);
        
        // Execute query
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        setUrls(data || []);
        
        // Calculate total pages
        if (count !== null) {
          setTotalPages(Math.ceil(count / itemsPerPage));
        }
      } catch (error) {
        console.error("Error fetching URLs:", error);
        setError("Failed to load URL data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, [currentPage, sortField, sortDirection, searchTerm]);

  // Update URL when search term changes
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchParams({ q: searchTerm, page: '1', sort: sortField, dir: sortDirection });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="URL Analytics - UrlZip"
        description="Track and analyze your shortened URLs with UrlZip."
        url="https://urlzip.in/analytics"
      />
      
      <div className="container mx-auto px-4 flex-1">
        <Header />
        
        <main className="py-8">
          <h1 className="text-3xl font-bold mb-8">URL Analytics</h1>
          
          {error ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-800 mb-6">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Search and filter section */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <div className="flex flex-1 gap-2 items-center">
                  <Input
                    placeholder="Search URLs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} className="shrink-0">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              {/* Chart section */}
              {!isLoading && urls.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <BarChartIcon className="h-5 w-5 mr-2 text-primary" />
                    Top URLs by Clicks
                  </h2>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              {/* Table section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">URL Details</h2>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <span className="ml-2 text-gray-600">Loading URLs...</span>
                  </div>
                ) : urls.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No shortened URLs found.</p>
                    {searchTerm && (
                      <p className="mt-2">
                        Try a different search term or
                        <Button variant="link" onClick={() => setSearchTerm('')} className="p-0 h-auto font-normal">
                          clear the search
                        </Button>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">
                            <Button 
                              variant="ghost" 
                              className="h-8 px-2 font-medium flex items-center"
                              onClick={() => handleSort('short_code')}
                            >
                              Short URL
                              {sortField === 'short_code' && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="h-8 px-2 font-medium flex items-center"
                              onClick={() => handleSort('original_url')}
                            >
                              Original URL
                              {sortField === 'original_url' && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[100px] text-right">
                            <Button 
                              variant="ghost" 
                              className="h-8 px-2 font-medium flex items-center justify-end"
                              onClick={() => handleSort('clicks')}
                            >
                              Clicks
                              {sortField === 'clicks' && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[150px]">
                            <Button 
                              variant="ghost" 
                              className="h-8 px-2 font-medium flex items-center"
                              onClick={() => handleSort('created_at')}
                            >
                              Created
                              {sortField === 'created_at' && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {urls.map((url) => (
                          <TableRow key={url.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Link2 className="h-4 w-4 mr-2 text-primary" />
                                <span>{url.short_code}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              <a 
                                href={url.original_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary hover:underline flex items-center gap-1"
                              >
                                {formatUrl(url.original_url)}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                            <TableCell className="text-right">{url.clicks}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                {url.created_at ? formatDate(url.created_at) : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(getFullShortUrl(url.short_code))}
                                className="h-8 px-2"
                              >
                                Copy
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="py-4 border-t border-gray-100">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }).map((_, index) => {
                          // Show 5 page links at most: current, 2 before, 2 after
                          if (
                            index + 1 === 1 || 
                            index + 1 === totalPages ||
                            (index + 1 >= currentPage - 1 && index + 1 <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={index}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(index + 1)}
                                  isActive={currentPage === index + 1}
                                >
                                  {index + 1}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            (index + 1 === currentPage - 2 && currentPage > 3) ||
                            (index + 1 === currentPage + 2 && currentPage < totalPages - 2)
                          ) {
                            return <PaginationItem key={index}>...</PaginationItem>;
                          }
                          return null;
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Analytics;
