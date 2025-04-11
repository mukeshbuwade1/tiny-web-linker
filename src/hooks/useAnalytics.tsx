
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyStats, SearchedUrlStats } from '@/types/analytics';
import { toast } from 'sonner';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUrls, setTotalUrls] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [searchedUrlStats, setSearchedUrlStats] = useState<SearchedUrlStats | null>(null);

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

  const resetSearch = () => {
    setSearchTerm('');
    setSearchedUrlStats(null);
  };

  return {
    isLoading,
    statsLoading,
    error,
    searchTerm,
    setSearchTerm,
    totalUrls,
    totalClicks,
    monthlyStats,
    searchedUrlStats,
    handleSearch,
    resetSearch
  };
};
