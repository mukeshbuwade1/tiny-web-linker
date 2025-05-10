
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon, Loader2, AlertCircle } from 'lucide-react';
import { MonthlyStats } from '@/types/analytics';
import { getCurrentEnvironment } from '@/integrations/supabase/client';

interface PlatformPerformanceProps {
  totalUrls: number;
  monthlyStats: MonthlyStats[];
  isLoading: boolean;
}

const PlatformPerformance: React.FC<PlatformPerformanceProps> = ({
  totalUrls,
  monthlyStats,
  isLoading
}) => {
  // Transform data for chart
  const chartData = monthlyStats.map(stat => ({
    month: stat.month,
    urls: stat.total_urls
  }));

  const environment = getCurrentEnvironment();
  const isProductionEnv = environment === 'production';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Platform Performance</h2>
        <div className="flex items-center text-xs text-gray-500">
          <InfoIcon className="h-3.5 w-3.5 mr-1" />
          Overall statistics 
        </div>
      </div>
      
      {!isProductionEnv && (
        <div className={`mb-4 p-2 rounded-md text-xs flex items-center ${isProductionEnv ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          {`Environment: ${environment.toUpperCase()}`}
        </div>
      )}
      
      {isLoading ? (
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
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="urls" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlatformPerformance;
