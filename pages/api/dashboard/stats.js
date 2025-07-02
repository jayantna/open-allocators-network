import dbConnect from '../../../lib/mongodb';
import { getAuthenticatedUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (user.role !== 'FUND') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // For now, return mock stats since we don't have analytics tracking implemented
    // In a real app, you would query actual analytics data from your database
    const stats = {
      profileViews: Math.floor(Math.random() * 100) + 50,
      interestedInvestors: Math.floor(Math.random() * 20) + 5,
      contactRequests: Math.floor(Math.random() * 10) + 2,
      monthlyGrowth: Math.floor(Math.random() * 30) + 10,
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}