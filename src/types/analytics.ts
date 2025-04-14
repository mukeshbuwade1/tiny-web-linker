
export interface MonthlyStats {
  month: string;
  total_urls: number;
  total_clicks: number;
}

export interface SearchedUrlStats {
  clicks: number;
  monthlyClicks: {month: string, clicks: number}[];
  shortCode: string | null;
}

export interface QrCodeStats {
  total: number;
  shortened: number;
  monthly: {month: string, total: number}[];
}

export interface EnvironmentInfo {
  name: string;
  isProduction: boolean;
  timestamp: string;
}
