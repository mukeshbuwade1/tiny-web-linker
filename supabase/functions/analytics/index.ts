import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { action } = body;

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from JWT if available
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (user && !userError) {
        userId = user.id;
      }
    }

    // Handle action for overview analytics data
    if (action === 'overview') {
      // Fetch total URL count
      const { data: urls, error: urlsError } = await supabase
        .from('short_urls')
        .select('*', { count: 'exact' });

      if (urlsError) throw urlsError;
      const totalUrls = urls ? urls.length : 0;

      // Fetch total click count
      const { data: clicksData, error: clicksError } = await supabase
        .from('short_urls')
        .select('clicks');

      if (clicksError) throw clicksError;
      const totalClicks = clicksData?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0;

      // Fetch monthly stats
      const { data: monthlyData, error: monthlyError } = await supabase.rpc('get_monthly_stats');

      if (monthlyError) throw monthlyError;

      // Fetch QR code stats
      const { data: qrCodeData, error: qrCodeError } = await supabase.rpc('get_qr_code_stats');

      if (qrCodeError) throw qrCodeError;

      return new Response(
        JSON.stringify({ 
          totalUrls, 
          totalClicks, 
          monthlyStats: monthlyData,
          qrCodeStats: qrCodeData
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Handle action for URL-specific analytics
    else if (action === 'url') {
      const { shortCode } = body;

      if (!shortCode) {
        return new Response(
          JSON.stringify({ error: 'Short code is required' }),
          { 
            status: 400, 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // Fetch URL details
      const { data: urlData, error: urlError } = await supabase
        .from('short_urls')
        .select('*')
        .eq('short_code', shortCode)
        .single();

      if (urlError) {
        console.error('Error fetching URL:', urlError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch URL' }),
          { 
            status: 500, 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      if (!urlData) {
        return new Response(
          JSON.stringify({ error: 'URL not found' }),
          { 
            status: 404, 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // Fetch monthly clicks for the URL
      const { data: monthlyClicks, error: monthlyClicksError } = await supabase.rpc('get_monthly_clicks', {
        short_code: shortCode
      });

      if (monthlyClicksError) {
        console.error('Error fetching monthly clicks:', monthlyClicksError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch monthly clicks' }),
          { 
            status: 500, 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          clicks: urlData.clicks || 0,
          monthlyClicks,
          shortCode: urlData.short_code
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Handle tracking QR code generation
    else if (action === 'track-qr-code') {
      const { content, wasShortened } = body;
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
      
      // Record the QR code generation
      await supabase
        .from('qr_code_analytics')
        .insert({
          user_id: userId,
          content: content,
          was_shortened: wasShortened,
        });
      
      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Handle unknown action
    else {
      return new Response(
        JSON.stringify({ error: 'Unknown action' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
