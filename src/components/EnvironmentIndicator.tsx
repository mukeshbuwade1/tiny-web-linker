
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { getCurrentEnvironment } from '@/integrations/supabase/client';
import { EnvironmentInfo } from '@/types/analytics';

interface EnvironmentIndicatorProps {
  compact?: boolean;
}

export const EnvironmentIndicator = ({ compact = false }: EnvironmentIndicatorProps) => {
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo>({
    name: getCurrentEnvironment(),
    isProduction: getCurrentEnvironment() === 'production',
    timestamp: new Date().toISOString()
  });

  // Styles based on environment
  const bgColor = envInfo.isProduction ? 'bg-green-50' : 'bg-amber-50';
  const textColor = envInfo.isProduction ? 'text-green-600' : 'text-amber-600';
  const borderColor = envInfo.isProduction ? 'border-green-200' : 'border-amber-200';

  if (compact) {
    return (
      <div className={`px-2 py-1 rounded text-xs flex items-center ${bgColor} ${textColor}`}>
        <AlertCircle className="h-3 w-3 mr-1" />
        {envInfo.name.toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-md border ${bgColor} ${textColor} ${borderColor}`}>
      <div className="flex items-center mb-2">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span className="font-medium">Environment: {envInfo.name.toUpperCase()}</span>
      </div>
      {!envInfo.isProduction && (
        <div className="text-xs">
          <p className="mb-1">⚠️ You are in the staging environment. Changes made here will not affect production data.</p>
          <p>To promote changes to production, follow these steps:</p>
          <ol className="list-decimal pl-5 mt-1 space-y-1">
            <li>Test all changes thoroughly in staging</li>
            <li>Use Supabase migration tools to export SQL changes</li>
            <li>Apply the exported SQL to your production database</li>
            <li>Switch to production environment by setting VITE_APP_ENV=production</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default EnvironmentIndicator;
