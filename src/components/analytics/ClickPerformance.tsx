
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon, Loader2 } from 'lucide-react';
import { MonthlyStats } from '@/types/analytics';
import { SearchedUrlStats } from '@/types/analytics';

interface ClickPerformanceProps {
  totalClicks: number;
  monthlyStats: MonthlyStats[];
  searchedUrlStats: SearchedUrlStats | null;
  isLoading: boolean;
}

const ClickPerformance: React.FC<ClickPerformanceProps> = ({
  totalClicks,
  monthlyStats,
  searchedUrlStats,
  isLoading
}) => {
  return (
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
      
      {isLoading ? (
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
  );
};

export default ClickPerformance;
