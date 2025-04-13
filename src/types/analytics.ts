
export interface MonthlyStats {
  month: string;
  totalClicks: number;
  totalUrls: number;
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
