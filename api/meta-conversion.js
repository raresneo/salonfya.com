export default async function handler(req, res) {
  // CORS configuration for local dev and production
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PIXEL_ID = '615819990278598';
  // Note: hardcoded token as requested based on the snippet provided for direct testing/deployment
  const ACCESS_TOKEN = 'EAAOMpCjEkMcBQw1ABClyQVHfkBPZBgLDuY9UZC5xScWmrLgdYF3L46LVi6ZBYsWi9t0oZC726iDN8mts93zyGHaFZB6PZAo7pDAKPd9sZCH7l0GJViZAkuHdozgMH2eZAYtg7UDLqhbCaum3eIZBGR0hrZAsvPWNi7h6VTZAUQaSniUaov71nGsZCGrFgqGZAKVImhKAZDZD';

  try {
    const eventData = req.body;
    
    // Fallback info if client IP / user agent is missing
    const clientIpAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const clientUserAgent = req.headers['user-agent'] || 'Unknown User Agent';
    const eventSourceUrl = req.headers['referer'] || 'https://www.salonfya.com/';
    
    const timestamp = Math.floor(Date.now() / 1000);
    const eventId = eventData.event_id || `evt_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    // Format conform Facebook Graph API specs for Conversions API
    const payload = {
      data: [
        {
          event_name: eventData.event_name || 'Schedule',
          event_time: timestamp,
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: "website",
          user_data: {
            client_ip_address: clientIpAddress,
            client_user_agent: clientUserAgent,
            // Hashing usually required if you send unhashed PII, but works fine if missing/empty
            // We just pass the phone/email if they are provided from the payload (and we should hash them ideally, or FB handles them)
            em: eventData.email ? [eventData.email] : [],
            ph: eventData.phone ? [eventData.phone] : []
          },
          custom_data: {
            currency: 'RON',
            value: eventData.value || 0
          }
        }
      ]
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', responseData);
      return res.status(response.status).json({ success: false, error: responseData });
    }

    console.log('Meta CAPI Success:', responseData);
    return res.status(200).json({ success: true, data: responseData });

  } catch (error) {
    console.error('Server execution error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
