
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate a random short code
function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a unique short code
    let shortCode = generateShortCode();
    let isUnique = false;
    
    // Make sure the short code is unique
    while (!isUnique) {
      const { data } = await supabase
        .from('short_urls')
        .select('short_code')
        .eq('short_code', shortCode)
        .maybeSingle();
      
      if (!data) {
        isUnique = true;
      } else {
        shortCode = generateShortCode();
      }
    }

    // Insert the new short URL into the database
    const { data, error } = await supabase
      .from('short_urls')
      .insert([
        { original_url: url, short_code: shortCode }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting URL:', error);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create short URL' }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Construct the short URL (using request URL for base)
    const baseUrl = new URL(req.url).origin.replace('/short-url-generator', '');
    const shortUrl = `${baseUrl}/${shortCode}`;

    // Return the short URL
    return new Response(
      JSON.stringify({ shortUrl, shortCode }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
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
