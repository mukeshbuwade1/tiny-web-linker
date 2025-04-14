
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyStats, SearchedUrlStats, QrCodeStats } from '@/types/analytics';
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
  const [qrCodeStats, setQrCodeStats] = useState<QrCodeStats | null>(null);

  const fetchAggregateStats = async () => {
    setStatsLoading(true);
    try {
      // Call the edge function to get aggregated stats
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { action: 'overview' }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      if (data.error) {
        console.error("API returned error:", data.error);
        throw new Error(data.error);
      }
      
      // Set state with the data returned from the edge function
      setTotalUrls(data.totalUrls);
      setTotalClicks(data.totalClicks);
      
      // Transform the monthly stats data to match our interface if needed
      const mappedMonthlyStats = data.monthlyStats?.map((stat: any) => ({
        month: stat.month,
        total_urls: stat.total_urls,
        total_clicks: stat.total_clicks
      })) || [];
      
      setMonthlyStats(mappedMonthlyStats);
      setQrCodeStats(data.qrCodeStats || null);
      
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
      // Call the edge function to get URL-specific stats
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { action: 'url', shortCode }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      if (data.error) {
        console.error("API returned error:", data.error);
        throw new Error(data.error);
      }
      
      setSearchedUrlStats(data);
      
    } catch (error) {
      console.error("Error fetching URL stats:", error);
      setSearchedUrlStats(null);
      toast.error("URL not found or error fetching stats");
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
    qrCodeStats,
    handleSearch,
    resetSearch
  };
};
