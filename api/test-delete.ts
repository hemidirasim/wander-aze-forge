import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('Test endpoint called:', {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body
  });

  if (req.method === 'DELETE') {
    return res.status(200).json({
      success: true,
      message: 'DELETE method works!',
      data: {
        method: req.method,
        url: req.url,
        query: req.query
      }
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
    receivedMethod: req.method
  });
}

