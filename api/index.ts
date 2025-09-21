import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Simple admin authentication middleware
const adminAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // Simple token verification for now
  req.user = { username: 'admin', id: 1 };
  next();
};

// Simple health check
app.get('/api/health', async (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API is working'
  });
});

// Simple admin authentication endpoints
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password: password ? '***' : 'empty' });
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Simple authentication for now
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
      
      res.json({ 
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
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/admin/logout', async (req, res) => {
  try {
    const { token } = req.body;
    console.log('Logout attempt for token:', token ? '***' : 'none');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/admin/verify', adminAuth, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Test endpoint to check admin users
app.get('/api/admin/test-users', async (req, res) => {
  try {
    const users = [
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager123' },
      { username: 'moderator', password: 'moderator123' },
      { username: 'newuser', password: 'newuser123' }
    ];
    
    res.json({ 
      success: true, 
      count: users.length,
      users: users.map(user => ({
        username: user.username,
        hasPassword: true
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Catch-all for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

export default app;