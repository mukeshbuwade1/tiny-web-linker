
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Meta from '@/components/Meta';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent 
} from '@/components/ui/chart';
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
  BarChart as BarChartIcon,
  Link2,
  Loader2,
  Hash,
  Calendar,
  ClipboardCopy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

interface UrlData {
  id: number;
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

interface MonthlyStats {
  month: string;
  totalClicks: number;
  totalUrls: number;
}

const Analytics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof UrlData>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUrls, setTotalUrls] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [searchedUrlStats, setSearchedUrlStats] = useState<{clicks: number, monthlyClicks: {month: string, clicks: number}[]} | null>(null);
  const itemsPerPage = 10;

  // Get aggregate stats for all URLs
  const fetchAggregateStats = async () => {
    setStatsLoading(true);
    try {
      // Get total URLs count
      const { count: urlCount, error: urlError } = await supabase
        .from('short_urls')
        .select('*', { count: 'exact', head: true });
      
      if (urlError) throw urlError;
      setTotalUrls(urlCount || 0);
      
      // Get total clicks
      const { data: clicksData, error: clicksError } = await supabase
        .from('short_urls')
        .select('clicks')
        .not('clicks', 'is', null);
      
      if (clicksError) throw clicksError;
      const totalClickCount = clicksData.reduce((sum, item) => sum + (item.clicks || 0), 0);
      setTotalClicks(totalClickCount);
      
      // Get monthly stats for the last 5 months
      const now = new Date();
      const monthlyStatsData: MonthlyStats[] = [];
      
      for (let i = 0; i < 5; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        // Format month name
        const monthName = month.toLocaleDateString('en-US', { month: 'short' });
        
        // Get URLs created in this month
        const { data: monthUrls, error: monthUrlsError } = await supabase
          .from('short_urls')
          .select('created_at, clicks')
          .gte('created_at', month.toISOString())
          .lte('created_at', monthEnd.toISOString());
        
        if (monthUrlsError) throw monthUrlsError;
        
        const monthlyClickCount = monthUrls.reduce((sum, item) => sum + (item.clicks || 0), 0);
        
        monthlyStatsData.push({
          month: monthName,
          totalClicks: monthlyClickCount,
          totalUrls: monthUrls.length
        });
      }
      
      // Reverse to show oldest to newest
      setMonthlyStats(monthlyStatsData.reverse());
    } catch (error) {
      console.error("Error fetching aggregate stats:", error);
      setError("Failed to load analytics data.");
    } finally {
      setStatsLoading(false);
    }
  };

  // Get stats for a specific URL when searched
  const fetchUrlStats = async (shortCode: string) => {
    setStatsLoading(true);
    try {
      const { data, error } = await supabase
        .from('short_urls')
        .select('clicks, created_at')
        .eq('short_code', shortCode)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Generate monthly clicks data (for demo purposes)
        // In a real app, this would come from a separate clicks table with timestamps
        const createdDate = new Date(data.created_at);
        const now = new Date();
        const monthlyClicksData = [];
        
        // Calculate months between creation and now (max 5)
        let monthsToShow = Math.min(5, 
          (now.getFullYear() - createdDate.getFullYear()) * 12 + 
          now.getMonth() - createdDate.getMonth() + 1);
        
        // If URL was created this month, show at least 1 month
        monthsToShow = Math.max(1, monthsToShow);
        
        // Generate random distribution of clicks per month
        // In a real app, this would be actual data from a clicks table
        const totalClicks = data.clicks || 0;
        let remainingClicks = totalClicks;
        
        for (let i = 0; i < monthsToShow; i++) {
          const month = new Date(now.getFullYear(), now.getMonth() - (monthsToShow - 1) + i);
          const monthName = month.toLocaleDateString('en-US', { month: 'short' });
          
          let monthClicks = 0;
          if (i === monthsToShow - 1) {
            // Last month gets all remaining clicks
            monthClicks = remainingClicks;
          } else {
            // Random distribution for other months
            const randomPercentage = Math.random() * 0.5; // 0-50% of remaining
            monthClicks = Math.floor(remainingClicks * randomPercentage);
            remainingClicks -= monthClicks;
          }
          
          monthlyClicksData.push({
            month: monthName,
            clicks: monthClicks
          });
        }
        
        setSearchedUrlStats({
          clicks: totalClicks,
          monthlyClicks: monthlyClicksData
        });
      }
    } catch (error) {
      console.error("Error fetching URL stats:", error);
      setSearchedUrlStats(null);
      toast.error("URL not found");
    } finally {
      setStatsLoading(false);
    }
  };

  // Format URL for privacy, showing only domain
  const formatUrlForPrivacy = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      // If invalid URL, return masked version
      return "***masked***";
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchedUrlStats(null);
      return;
    }
    
    // Clear previous search results
    setCurrentPage(1);
    
    // Search by short code
    fetchUrlStats(searchTerm.trim());
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get full URL
  const getFullShortUrl = (shortCode: string) => {
    return `${window.location.origin}/${shortCode}`;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Calculate offset based on current page
        const offset = (currentPage - 1) * itemsPerPage;
        
        // Build query based on sorting
        let query = supabase
          .from('short_urls')
          .select('*', { count: 'exact' });
        
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
      
      // Fetch aggregate stats after loading initial data
      fetchAggregateStats();
    };

    loadInitialData();
  }, [currentPage, sortField, sortDirection]);

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
              {/* Search URL section */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <div className="flex flex-1 gap-2 items-center">
                  <Input
                    placeholder="Search by short code..."
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
              
              {/* Summary stats section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Aggregate Stats Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                  <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
                  
                  {statsLoading ? (
                    <div className="flex items-center justify-center flex-1">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <div className="text-indigo-600 font-medium mb-1">Total URLs</div>
                          <div className="text-2xl font-bold">{totalUrls}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-green-600 font-medium mb-1">Total Clicks</div>
                          <div className="text-2xl font-bold">{totalClicks}</div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-2">Monthly URL Creation</h3>
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyStats}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Bar dataKey="totalUrls" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Clicks Stats Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-4">
                    {searchedUrlStats ? `Stats for "${searchTerm}"` : "Monthly Click Performance"}
                  </h2>
                  
                  {statsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : (
                    <>
                      {searchedUrlStats ? (
                        <>
                          <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                            <div className="text-indigo-600 font-medium mb-1">Total Clicks</div>
                            <div className="text-2xl font-bold">{searchedUrlStats.clicks}</div>
                          </div>
                          
                          <h3 className="text-base font-medium mb-2">Monthly Clicks</h3>
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={searchedUrlStats.monthlyClicks}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-base font-medium mb-2">Monthly Clicks</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={monthlyStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="totalClicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Table section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Recent URLs</h2>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <span className="ml-2 text-gray-600">Loading URLs...</span>
                  </div>
                ) : urls.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No shortened URLs found.</p>
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
                              Short Code
                              {sortField === 'short_code' && (
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-2 h-4 w-4" /> :
                                <ChevronDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="h-8 px-2 font-medium flex items-center"
                            >
                              Domain
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
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-2 h-4 w-4" /> :
                                <ChevronDown className="ml-2 h-4 w-4" />
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
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-2 h-4 w-4" /> :
                                <ChevronDown className="ml-2 h-4 w-4" />
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
                                <Hash className="h-4 w-4 mr-2 text-primary" />
                                <span>{url.short_code}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{formatUrlForPrivacy(url.original_url)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{url.clicks || 0}</TableCell>
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
                                className="h-8 px-2 flex items-center"
                              >
                                <ClipboardCopy className="h-4 w-4 mr-1" />
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
