
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  BarChartIcon,
  Link2,
  Loader2,
  Hash,
  InfoIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

interface MonthlyStats {
  month: string;
  totalClicks: number;
  totalUrls: number;
}

const Analytics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUrls, setTotalUrls] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [searchedUrlStats, setSearchedUrlStats] = useState<{clicks: number, monthlyClicks: {month: string, clicks: number}[]}, shortCode: string | null>(null);

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

  // Extract short code from full URL
  const extractShortCode = (url: string): string | null => {
    try {
      // Try to extract from full URL format (e.g., urlzip.in/HrXnyc or https://urlzip.in/HrXnyc)
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        return pathParts[0];
      }
      
      // If no path parts, maybe it's just the short code
      return url.trim();
    } catch (error) {
      // If not a valid URL, assume it's just the short code
      return url.trim();
    }
  };

  // Get stats for a specific URL when searched
  const fetchUrlStats = async (searchInput: string) => {
    setStatsLoading(true);
    
    // Try to extract short code if full URL is provided
    const shortCode = extractShortCode(searchInput);
    
    if (!shortCode) {
      toast.error("Invalid URL or short code");
      setStatsLoading(false);
      return;
    }
    
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
          monthlyClicks: monthlyClicksData,
          shortCode
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

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchedUrlStats(null);
      return;
    }
    
    // Search by short code or full URL
    fetchUrlStats(searchTerm.trim());
  };

  useEffect(() => {
    // Load initial data
    setIsLoading(true);
    
    // Fetch aggregate stats
    fetchAggregateStats()
      .finally(() => setIsLoading(false));
  }, []);

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
                    placeholder="Enter short code or full URL (e.g., urlzip.in/abc123)..."
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
                {/* URL Creation Stats Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Platform Performance</h2>
                    <div className="flex items-center text-xs text-gray-500">
                      <InfoIcon className="h-3.5 w-3.5 mr-1" />
                      Overall statistics 
                    </div>
                  </div>
                  
                  {statsLoading ? (
                    <div className="flex items-center justify-center flex-1">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                        <div className="text-indigo-600 font-medium mb-1">Total URLs</div>
                        <div className="text-2xl font-bold">{totalUrls}</div>
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      {searchedUrlStats ? `URL Performance` : "Click Performance"}
                    </h2>
                    <div className="flex items-center text-xs text-gray-500">
                      <InfoIcon className="h-3.5 w-3.5 mr-1" />
                      {searchedUrlStats ? `Stats for "${searchedUrlStats.shortCode}"` : "All URLs combined"}
                    </div>
                  </div>
                  
                  {statsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="bg-green-50 p-4 rounded-lg mb-6">
                        <div className="text-green-600 font-medium mb-1">
                          {searchedUrlStats ? "URL Clicks" : "Total Clicks"}
                        </div>
                        <div className="text-2xl font-bold">
                          {searchedUrlStats ? searchedUrlStats.clicks : totalClicks}
                        </div>
                      </div>
                      
                      <h3 className="text-base font-medium mb-2">Monthly Clicks</h3>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={searchedUrlStats ? searchedUrlStats.monthlyClicks : monthlyStats}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar 
                              dataKey={searchedUrlStats ? "clicks" : "totalClicks"} 
                              fill="#10b981" 
                              radius={[4, 4, 0, 0]} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}
                </div>
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
