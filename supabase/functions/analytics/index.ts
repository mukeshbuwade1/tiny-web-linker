
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define CORS headers for our function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the project URL and anon key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://canfxcahoyelwlahexrf.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbmZ4Y2Fob3llbHdsYWhleHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Mjg2NDgsImV4cCI6MjA1OTUwNDY0OH0.5ui_bcMYWJlEDx8wtbxL8EApEoj7C3Ig3mJkkxWxx4s';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the request body
    const requestData = await req.json();
    const { action, shortCode } = requestData;

    // Determine which analytics data to fetch based on the action
    if (action === 'overview') {
      // Get total URLs count
      const { count: totalUrls, error: urlError } = await supabase
        .from('short_urls')
        .select('*', { count: 'exact', head: true });
      
      if (urlError) throw urlError;
      
      // Get total clicks
      const { data: clicksData, error: clicksError } = await supabase
        .from('short_urls')
        .select('clicks')
        .not('clicks', 'is', null);
      
      if (clicksError) throw clicksError;
      const totalClicks = clicksData.reduce((sum, item) => sum + (item.clicks || 0), 0);
      
      // Get monthly stats for the last 5 months
      const now = new Date();
      const monthlyStats = [];
      
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
        
        monthlyStats.push({
          month: monthName,
          totalClicks: monthlyClickCount,
          totalUrls: monthUrls.length
        });
      }
      
      // Return overview data
      return new Response(
        JSON.stringify({
          totalUrls: totalUrls || 0,
          totalClicks,
          monthlyStats: monthlyStats.reverse() // Oldest to newest
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    } 
    else if (action === 'url' && shortCode) {
      // Fetch stats for a specific URL
      const { data, error } = await supabase
        .from('short_urls')
        .select('clicks, created_at')
        .eq('short_code', shortCode)
        .single();
      
      if (error) {
        return new Response(
          JSON.stringify({ error: 'URL not found' }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 404 
          }
        );
      }
      
      // Generate monthly clicks data
      const createdDate = new Date(data.created_at);
      const now = new Date();
      const monthlyClicksData = [];
      
      // Calculate months between creation and now (max 5)
      let monthsToShow = Math.min(5, 
        (now.getFullYear() - createdDate.getFullYear()) * 12 + 
        now.getMonth() - createdDate.getMonth() + 1);
      
      // If URL was created this month, show at least 1 month
      monthsToShow = Math.max(1, monthsToShow);
      
      // Generate distribution of clicks per month (simplified for demo)
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
      
      return new Response(
        JSON.stringify({
          clicks: totalClicks,
          monthlyClicks: monthlyClicksData,
          shortCode
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    }
    
    // Invalid action
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
