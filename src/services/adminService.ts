import { ADMIN_CONFIG } from '../config/admin';

export interface AdminUser {
  id: string;
  username: string;
  permissions: string[];
  lastLogin: Date;
}

export class AdminService {
  private static adminUsers: Map<string, AdminUser> = new Map();
  private static sessions: Map<string, string> = new Map();

  // Initialize default admin user
  static initializeAdmin() {
    const defaultAdmin: AdminUser = {
      id: '1',
      username: ADMIN_CONFIG.ADMIN_USERNAME,
      permissions: ['manage_tours', 'manage_projects', 'manage_programs', 'manage_partners', 'manage_blog', 'manage_bookings', 'manage_contact', 'manage_files', 'view_analytics'],
      lastLogin: new Date()
    };
    
    this.adminUsers.set(defaultAdmin.username, defaultAdmin);
  }

  // Authenticate admin user
  static authenticate(username: string, password: string): { success: boolean; token?: string; user?: AdminUser } {
    if (username === ADMIN_CONFIG.ADMIN_USERNAME && password === ADMIN_CONFIG.ADMIN_PASSWORD) {
      const user = this.adminUsers.get(username);
      if (user) {
        user.lastLogin = new Date();
        const token = this.generateToken();
        this.sessions.set(token, username);
        return { success: true, token, user };
      }
    }
    return { success: false };
  }

  // Verify admin token
  static verifyToken(token: string): AdminUser | null {
    const username = this.sessions.get(token);
    if (username) {
      return this.adminUsers.get(username) || null;
    }
    return null;
  }

  // Logout admin
  static logout(token: string): boolean {
    return this.sessions.delete(token);
  }

  // Check if user has permission
  static hasPermission(user: AdminUser, permission: string): boolean {
    return user.permissions.includes(permission);
  }

  // Generate simple token (in production, use JWT)
  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Get all admin users (for management)
  static getAllAdmins(): AdminUser[] {
    return Array.from(this.adminUsers.values());
  }

  // Create new admin user
  static createAdmin(username: string, permissions: string[]): AdminUser {
    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      username,
      permissions,
      lastLogin: new Date()
    };
    
    this.adminUsers.set(username, newAdmin);
    return newAdmin;
  }

  // Update admin permissions
  static updateAdminPermissions(username: string, permissions: string[]): boolean {
    const admin = this.adminUsers.get(username);
    if (admin) {
      admin.permissions = permissions;
      return true;
    }
    return false;
  }

  // Delete admin user
  static deleteAdmin(username: string): boolean {
    return this.adminUsers.delete(username);
  }
}

// Initialize admin service
AdminService.initializeAdmin();
