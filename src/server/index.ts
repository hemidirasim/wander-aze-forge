import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { testConnection } from '../config/database';
import { DatabaseService } from '../services/databaseService';
import { AdminService } from '../services/adminService';
import uploadRouter from './upload';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Admin authentication middleware
const adminAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const user = AdminService.verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.adminUser = user;
  next();
};
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      status: 'ok',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Admin authentication endpoints
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    const result = AdminService.authenticate(username, password);
    
    if (result.success) {
      res.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

app.post('/api/admin/logout', (req, res) => {
  try {
    const { token } = req.body;
    
    if (token) {
      AdminService.logout(token);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

app.get('/api/admin/verify', adminAuth, (req: any, res) => {
  res.json({
    success: true,
    user: req.adminUser
  });
});

// Tours endpoints
app.get('/api/tours', async (req, res) => {
  try {
    const tours = await DatabaseService.getAllTours();
    res.json(tours);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tours',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/tours/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tour = await DatabaseService.getTourById(id);
    
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    res.json(tour);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/tours/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const tours = await DatabaseService.getToursByCategory(category);
    res.json(tours);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tours by category',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Bookings endpoints
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await DatabaseService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/bookings/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const bookings = await DatabaseService.getBookingsByEmail(email);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Contact messages endpoints
app.post('/api/contact', async (req, res) => {
  try {
    const message = await DatabaseService.createContactMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to send message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/contact/messages', async (req, res) => {
  try {
    const messages = await DatabaseService.getAllContactMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch messages',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Blog posts endpoints
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await DatabaseService.getAllBlogPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch blog posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = await DatabaseService.getBlogPostById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch blog post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Projects endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await DatabaseService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = await DatabaseService.getProjectById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/projects/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const projects = await DatabaseService.getProjectsByCategory(category);
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch projects by category',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Programs endpoints
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await DatabaseService.getAllPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch programs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const program = await DatabaseService.getProgramById(id);
    
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    res.json(program);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch program',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/programs/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const programs = await DatabaseService.getProgramsByType(type);
    res.json(programs);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch programs by type',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Partners endpoints
app.get('/api/partners', async (req, res) => {
  try {
    const partners = await DatabaseService.getAllPartners();
    res.json(partners);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch partners',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/partners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const partner = await DatabaseService.getPartnerById(id);
    
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    
    res.json(partner);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch partner',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/partners/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const partners = await DatabaseService.getPartnersByType(type);
    res.json(partners);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch partners by type',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Tour Programs endpoints
app.get('/api/tour-programs/:tourId', async (req, res) => {
  try {
    const tourId = parseInt(req.params.tourId);
    const programs = await DatabaseService.getTourProgramsByTourId(tourId);
    res.json(programs);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tour programs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/tour-programs/program/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const program = await DatabaseService.getTourProgramById(id);
    
    if (!program) {
      return res.status(404).json({ error: 'Tour program not found' });
    }
    
    res.json(program);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tour program',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/tour-programs', async (req, res) => {
  try {
    const program = await DatabaseService.createTourProgram(req.body);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create tour program',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put('/api/tour-programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const program = await DatabaseService.updateTourProgram(id, req.body);
    
    if (!program) {
      return res.status(404).json({ error: 'Tour program not found' });
    }
    
    res.json(program);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update tour program',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/tour-programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await DatabaseService.deleteTourProgram(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Tour program not found' });
    }
    
    res.json({ message: 'Tour program deleted successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete tour program',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// File upload routes
app.use('/api/upload', uploadRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
