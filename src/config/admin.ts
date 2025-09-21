// Admin configuration
export const ADMIN_CONFIG = {
  // Simple admin credentials (in production, use proper authentication)
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  
  // Session configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key-here',
  
  // Admin routes
  ADMIN_LOGIN_PATH: '/admin/login',
  ADMIN_DASHBOARD_PATH: '/admin/dashboard',
  ADMIN_BASE_PATH: '/admin'
};

// Admin permissions
export const ADMIN_PERMISSIONS = {
  MANAGE_TOURS: 'manage_tours',
  MANAGE_PROJECTS: 'manage_projects', 
  MANAGE_PROGRAMS: 'manage_programs',
  MANAGE_PARTNERS: 'manage_partners',
  MANAGE_BLOG: 'manage_blog',
  MANAGE_BOOKINGS: 'manage_bookings',
  MANAGE_CONTACT: 'manage_contact',
  MANAGE_FILES: 'manage_files',
  VIEW_ANALYTICS: 'view_analytics'
};

// Default admin permissions
export const DEFAULT_ADMIN_PERMISSIONS = Object.values(ADMIN_PERMISSIONS);
