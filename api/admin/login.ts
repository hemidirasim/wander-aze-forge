import { VercelRequest, VercelResponse } from '@vercel/node';
import { AdminService } from '../../src/services/adminService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
