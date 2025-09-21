import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { testConnection } from '../src/config/database';
import { DatabaseService } from '../src/services/databaseService';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
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

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: dbStatus,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasAdminUsername: !!process.env.ADMIN_USERNAME,
        hasAdminPassword: !!process.env.ADMIN_PASSWORD
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasAdminUsername: !!process.env.ADMIN_USERNAME,
        hasAdminPassword: !!process.env.ADMIN_PASSWORD
      }
    });
  }
});

// Tours endpoints
app.get('/api/tours', async (req, res) => {
  try {
    const tours = await DatabaseService.getAllTours();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

app.get('/api/tours/:id', async (req, res) => {
  try {
    const tour = await DatabaseService.getTourById(parseInt(req.params.id));
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// Projects endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await DatabaseService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await DatabaseService.getProjectById(parseInt(req.params.id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Programs endpoints
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await DatabaseService.getAllPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

app.get('/api/programs/:id', async (req, res) => {
  try {
    const program = await DatabaseService.getProgramById(parseInt(req.params.id));
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch program' });
  }
});

// Partners endpoints
app.get('/api/partners', async (req, res) => {
  try {
    const partners = await DatabaseService.getAllPartners();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

app.get('/api/partners/:id', async (req, res) => {
  try {
    const partner = await DatabaseService.getPartnerById(parseInt(req.params.id));
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
});

// Tour Programs endpoints
app.get('/api/tour-programs/:tourId', async (req, res) => {
  try {
    const programs = await DatabaseService.getTourProgramsByTourId(parseInt(req.params.tourId));
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tour programs' });
  }
});

app.get('/api/tour-programs/program/:id', async (req, res) => {
  try {
    const program = await DatabaseService.getTourProgramById(parseInt(req.params.id));
    if (!program) {
      return res.status(404).json({ error: 'Tour program not found' });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tour program' });
  }
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

// Bookings endpoints
app.post('/api/bookings', async (req, res) => {
  try {
    const { tourId, name, email, phone, date, participants, message } = req.body;
    const booking = await DatabaseService.createBooking({
      tourId,
      name,
      email,
      phone,
      date: new Date(date),
      participants,
      message
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Contact endpoints
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contactMessage = await DatabaseService.createContactMessage({
      name,
      email,
      subject,
      message
    });
    res.status(201).json(contactMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Blog endpoints
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await DatabaseService.getAllBlogPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const post = await DatabaseService.getBlogPostById(parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Catch-all for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

export default app;
