
import React from 'react';
import Meta from '@/components/Meta';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/analytics/SearchBar';
import PlatformPerformance from '@/components/analytics/PlatformPerformance';
import ClickPerformance from '@/components/analytics/ClickPerformance';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Analytics: React.FC = () => {
  const {
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
  } = useAnalytics();

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
              {searchedUrlStats && (
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetSearch}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Overview
                  </Button>
                </div>
              )}
              
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
              />
              
              {/* Stats cards section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Only show Platform Performance if not viewing a searched URL */}
                {!searchedUrlStats && (
                  <PlatformPerformance
                    totalUrls={totalUrls}
                    monthlyStats={monthlyStats}
                    isLoading={statsLoading}
                  />
                )}
                
                {/* Click Performance - this expands to full width when searchedUrlStats is active */}
                <div className={`${searchedUrlStats ? 'col-span-full' : ''}`}>
                  <ClickPerformance
                    totalClicks={totalClicks}
                    monthlyStats={monthlyStats}
                    searchedUrlStats={searchedUrlStats}
                    isLoading={statsLoading}
                  />
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
