import pool from '../config/database';

export interface Tour {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: number;
  max_participants: number;
  image_url?: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: string;
  requirements?: string;
  special_fields?: any;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  tour_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  participants: number;
  booking_date: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  status: string;
  featured: boolean;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status: string;
  image_url?: string;
  gallery_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: number;
  name: string;
  description?: string;
  type?: string;
  duration?: string;
  target_audience?: string;
  objectives?: string;
  activities?: string[];
  status: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: number;
  name: string;
  type?: string;
  description?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  partnership_type?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TourProgram {
  id: number;
  tour_id: number;
  day_number: number;
  day_title: string;
  day_overview?: string;
  difficulty?: string;
  elevation?: string;
  distance?: string;
  activities: any[];
  highlights?: string[];
  meals?: string[];
  accommodation?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  full_name?: string;
  permissions: string[];
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export class DatabaseService {
  // Tours
  static async getAllTours(): Promise<Tour[]> {
    const result = await pool.query('SELECT * FROM tours ORDER BY created_at DESC');
    return result.rows;
  }

  static async getTourById(id: number): Promise<Tour | null> {
    const result = await pool.query('SELECT * FROM tours WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async getToursByCategory(category: string): Promise<Tour[]> {
    const result = await pool.query('SELECT * FROM tours WHERE category = $1 ORDER BY created_at DESC', [category]);
    return result.rows;
  }

  static async createTour(tour: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): Promise<Tour> {
    const result = await pool.query(
      `INSERT INTO tours (title, description, category, duration, difficulty, price, max_participants, image_url, highlights, includes, excludes, itinerary, requirements, special_fields)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        tour.title, 
        tour.description, 
        tour.category, 
        tour.duration, 
        tour.difficulty, 
        tour.price, 
        tour.max_participants, 
        tour.image_url,
        tour.highlights ? JSON.stringify(tour.highlights) : null,
        tour.includes ? JSON.stringify(tour.includes) : null,
        tour.excludes ? JSON.stringify(tour.excludes) : null,
        tour.itinerary,
        tour.requirements,
        tour.special_fields ? JSON.stringify(tour.special_fields) : null
      ]
    );
    return result.rows[0];
  }

  // Bookings
  static async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const result = await pool.query(
      `INSERT INTO bookings (tour_id, customer_name, customer_email, customer_phone, participants, booking_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [booking.tour_id, booking.customer_name, booking.customer_email, booking.customer_phone, booking.participants, booking.booking_date, booking.total_price, booking.status]
    );
    return result.rows[0];
  }

  static async getBookingsByEmail(email: string): Promise<Booking[]> {
    const result = await pool.query('SELECT * FROM bookings WHERE customer_email = $1 ORDER BY created_at DESC', [email]);
    return result.rows;
  }

  // Contact Messages
  static async createContactMessage(message: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [message.name, message.email, message.phone, message.message]
    );
    return result.rows[0];
  }

  static async getAllContactMessages(): Promise<ContactMessage[]> {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return result.rows;
  }

  // Blog Posts
  static async getAllBlogPosts(): Promise<BlogPost[]> {
    const result = await pool.query('SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC');
    return result.rows;
  }

  static async getBlogPostById(id: number): Promise<BlogPost | null> {
    const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1 AND published = true', [id]);
    return result.rows[0] || null;
  }

  static async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const result = await pool.query(
      `INSERT INTO blog_posts (title, content, excerpt, author, category, tags, featured_image, status, featured, image_url, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        post.title, 
        post.content, 
        post.excerpt, 
        post.author, 
        post.category, 
        post.tags, 
        post.featured_image, 
        post.status || 'published', 
        post.featured || false,
        post.image_url, 
        post.published
      ]
    );
    return result.rows[0];
  }

  // Projects
  static async getAllProjects(): Promise<Project[]> {
    const result = await pool.query('SELECT * FROM projects WHERE status = \'active\' ORDER BY created_at DESC');
    return result.rows;
  }

  static async getProjectById(id: number): Promise<Project | null> {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1 AND status = \'active\'', [id]);
    return result.rows[0] || null;
  }

  static async getProjectsByCategory(category: string): Promise<Project[]> {
    const result = await pool.query('SELECT * FROM projects WHERE category = $1 AND status = \'active\' ORDER BY created_at DESC', [category]);
    return result.rows;
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const result = await pool.query(
      `INSERT INTO projects (title, description, category, location, start_date, end_date, budget, status, image_url, gallery_urls)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [project.title, project.description, project.category, project.location, project.start_date, project.end_date, project.budget, project.status, project.image_url, project.gallery_urls]
    );
    return result.rows[0];
  }

  // Programs
  static async getAllPrograms(): Promise<Program[]> {
    const result = await pool.query('SELECT * FROM programs WHERE status = \'active\' ORDER BY created_at DESC');
    return result.rows;
  }

  static async getProgramById(id: number): Promise<Program | null> {
    const result = await pool.query('SELECT * FROM programs WHERE id = $1 AND status = \'active\'', [id]);
    return result.rows[0] || null;
  }

  static async getProgramsByType(type: string): Promise<Program[]> {
    const result = await pool.query('SELECT * FROM programs WHERE type = $1 AND status = \'active\' ORDER BY created_at DESC', [type]);
    return result.rows;
  }

  static async createProgram(program: Omit<Program, 'id' | 'created_at' | 'updated_at'>): Promise<Program> {
    const result = await pool.query(
      `INSERT INTO programs (name, description, type, duration, target_audience, objectives, activities, status, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [program.name, program.description, program.type, program.duration, program.target_audience, program.objectives, program.activities, program.status, program.image_url]
    );
    return result.rows[0];
  }

  // Partners
  static async getAllPartners(): Promise<Partner[]> {
    const result = await pool.query('SELECT * FROM partners WHERE status = \'active\' ORDER BY created_at DESC');
    return result.rows;
  }

  static async getPartnerById(id: number): Promise<Partner | null> {
    const result = await pool.query('SELECT * FROM partners WHERE id = $1 AND status = \'active\'', [id]);
    return result.rows[0] || null;
  }

  static async getPartnersByType(type: string): Promise<Partner[]> {
    const result = await pool.query('SELECT * FROM partners WHERE type = $1 AND status = \'active\' ORDER BY created_at DESC', [type]);
    return result.rows;
  }

  static async createPartner(partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<Partner> {
    const result = await pool.query(
      `INSERT INTO partners (name, type, description, website_url, contact_email, contact_phone, logo_url, partnership_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [partner.name, partner.type, partner.description, partner.website_url, partner.contact_email, partner.contact_phone, partner.logo_url, partner.partnership_type, partner.status]
    );
    return result.rows[0];
  }

  // Tour Programs
  static async getTourProgramsByTourId(tourId: number): Promise<TourProgram[]> {
    const result = await pool.query(
      'SELECT * FROM tour_programs WHERE tour_id = $1 ORDER BY day_number ASC',
      [tourId]
    );
    return result.rows;
  }

  static async getTourProgramById(id: number): Promise<TourProgram | null> {
    const result = await pool.query('SELECT * FROM tour_programs WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createTourProgram(program: Omit<TourProgram, 'id' | 'created_at' | 'updated_at'>): Promise<TourProgram> {
    const result = await pool.query(
      `INSERT INTO tour_programs (tour_id, day_number, day_title, day_overview, difficulty, elevation, distance, activities, highlights, meals, accommodation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [program.tour_id, program.day_number, program.day_title, program.day_overview, program.difficulty, program.elevation, program.distance, JSON.stringify(program.activities), program.highlights, program.meals, program.accommodation]
    );
    return result.rows[0];
  }

  static async updateTourProgram(id: number, program: Partial<Omit<TourProgram, 'id' | 'created_at' | 'updated_at'>>): Promise<TourProgram> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(program).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'activities') {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    values.push(id);
    const result = await pool.query(
      `UPDATE tour_programs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async deleteTourProgram(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM tour_programs WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Admin Users
  static async getAdminUserByUsername(username: string): Promise<AdminUser | null> {
    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1 AND is_active = true', [username]);
    return result.rows[0] || null;
  }

  static async getAdminUserById(id: number): Promise<AdminUser | null> {
    const result = await pool.query('SELECT * FROM admin_users WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0] || null;
  }

  static async createAdminUser(user: Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>): Promise<AdminUser> {
    const result = await pool.query(
      'INSERT INTO admin_users (username, password_hash, email, full_name, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.username, user.password_hash, user.email, user.full_name, user.permissions, user.is_active]
    );
    return result.rows[0];
  }

  static async updateAdminUserLastLogin(id: number): Promise<void> {
    await pool.query('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }

  static async getAllAdminUsers(): Promise<AdminUser[]> {
    const result = await pool.query('SELECT * FROM admin_users ORDER BY created_at DESC');
    return result.rows;
  }

  static async updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<AdminUser> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        if (key === 'permissions') {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    values.push(id);
    const result = await pool.query(
      `UPDATE admin_users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async deleteAdminUser(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM admin_users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Admin Sessions
  static async createAdminSession(session: Omit<AdminSession, 'id' | 'created_at'>): Promise<AdminSession> {
    const result = await pool.query(
      'INSERT INTO admin_sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [session.user_id, session.token, session.expires_at]
    );
    return result.rows[0];
  }

  static async getAdminSessionByToken(token: string): Promise<AdminSession | null> {
    const result = await pool.query('SELECT * FROM admin_sessions WHERE token = $1 AND expires_at > NOW()', [token]);
    return result.rows[0] || null;
  }

  static async deleteAdminSession(token: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM admin_sessions WHERE token = $1', [token]);
    return result.rowCount > 0;
  }

  static async deleteExpiredAdminSessions(): Promise<number> {
    const result = await pool.query('DELETE FROM admin_sessions WHERE expires_at <= NOW()');
    return result.rowCount || 0;
  }

  static async deleteAllAdminSessionsForUser(userId: number): Promise<number> {
    const result = await pool.query('DELETE FROM admin_sessions WHERE user_id = $1', [userId]);
    return result.rowCount || 0;
  }
}
