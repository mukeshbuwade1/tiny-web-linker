
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
