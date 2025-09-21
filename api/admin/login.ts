import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password: password ? '***' : 'empty' });
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Simple authentication
    const validUsers = [
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager123' },
      { username: 'moderator', password: 'moderator123' },
      { username: 'newuser', password: 'newuser123' }
    ];

    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      console.log('Authentication successful for:', username);
      
      return res.status(200).json({ 
        success: true, 
        token, 
        user: { 
          username: user.username, 
          id: 1,
          permissions: ['manage_tours', 'manage_projects', 'manage_programs', 'manage_partners', 'manage_blog', 'view_analytics']
        } 
      });
    } else {
      console.log('Authentication failed for:', username);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}