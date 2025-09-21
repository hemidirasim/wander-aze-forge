import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    return res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      message: 'API is working'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Health check failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
