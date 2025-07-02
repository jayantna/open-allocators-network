import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import dbConnect from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
console.log(JWT_SECRET, 'JWT')

export function generateJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUser(req) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return null;
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function createAuthMiddleware(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const user = await getAuthenticatedUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (user.status !== 'APPROVED') {
        return res.status(403).json({ error: 'Account not approved' });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Middleware error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
}

export async function hashPassword(password) {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashedPassword) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}