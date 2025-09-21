import bcrypt from 'bcryptjs';
import { DatabaseService, AdminUser, AdminSession } from './databaseService';

export interface AdminUserPublic {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  permissions: string[];
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export class DatabaseAdminService {
  // Hash password
  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  private static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate session token
  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Authenticate admin user
  static async authenticate(username: string, password: string): Promise<{ success: boolean; token?: string; user?: AdminUserPublic }> {
    try {
      const user = await DatabaseService.getAdminUserByUsername(username);
      
      if (!user) {
        return { success: false };
      }

      const isValidPassword = await this.verifyPassword(password, user.password_hash);
      
      if (!isValidPassword) {
        return { success: false };
      }

      // Update last login
      await DatabaseService.updateAdminUserLastLogin(user.id);

      // Create session
      const token = this.generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

      await DatabaseService.createAdminSession({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString()
      });

      // Return public user data
      const publicUser: AdminUserPublic = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        permissions: user.permissions,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at
      };

      return { success: true, token, user: publicUser };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false };
    }
  }

  // Verify token
  static async verifyToken(token: string): Promise<AdminUserPublic | null> {
    try {
      const session = await DatabaseService.getAdminSessionByToken(token);
      
      if (!session) {
        return null;
      }

      const user = await DatabaseService.getAdminUserById(session.user_id);
      
      if (!user || !user.is_active) {
        return null;
      }

      // Return public user data
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        permissions: user.permissions,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // Logout
  static async logout(token: string): Promise<boolean> {
    try {
      return await DatabaseService.deleteAdminSession(token);
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // Create admin user
  static async createAdminUser(userData: {
    username: string;
    password: string;
    email?: string;
    full_name?: string;
    permissions?: string[];
  }): Promise<AdminUserPublic> {
    const passwordHash = await this.hashPassword(userData.password);
    
    const defaultPermissions = [
      'manage_tours',
      'manage_projects', 
      'manage_programs',
      'manage_partners',
      'manage_blog',
      'manage_bookings',
      'manage_contact',
      'manage_files',
      'view_analytics'
    ];

    const user = await DatabaseService.createAdminUser({
      username: userData.username,
      password_hash: passwordHash,
      email: userData.email,
      full_name: userData.full_name,
      permissions: userData.permissions || defaultPermissions,
      is_active: true
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      permissions: user.permissions,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  // Get all admin users
  static async getAllAdminUsers(): Promise<AdminUserPublic[]> {
    const users = await DatabaseService.getAllAdminUsers();
    
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      permissions: user.permissions,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  }

  // Update admin user
  static async updateAdminUser(id: number, updates: {
    email?: string;
    full_name?: string;
    permissions?: string[];
    is_active?: boolean;
  }): Promise<AdminUserPublic | null> {
    const user = await DatabaseService.updateAdminUser(id, updates);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      permissions: user.permissions,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  // Change password
  static async changePassword(id: number, newPassword: string): Promise<boolean> {
    try {
      const passwordHash = await this.hashPassword(newPassword);
      await DatabaseService.updateAdminUser(id, { password_hash: passwordHash });
      
      // Delete all sessions for this user to force re-login
      await DatabaseService.deleteAllAdminSessionsForUser(id);
      
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  // Delete admin user
  static async deleteAdminUser(id: number): Promise<boolean> {
    try {
      // Delete all sessions first
      await DatabaseService.deleteAllAdminSessionsForUser(id);
      
      // Delete user
      return await DatabaseService.deleteAdminUser(id);
    } catch (error) {
      console.error('Delete admin user error:', error);
      return false;
    }
  }

  // Cleanup expired sessions
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      return await DatabaseService.deleteExpiredAdminSessions();
    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
      return 0;
    }
  }

  // Check if user has permission
  static hasPermission(user: AdminUserPublic, permission: string): boolean {
    return user.permissions.includes(permission);
  }
}
