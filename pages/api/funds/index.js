import dbConnect from '../../../lib/mongodb';
import { User, FundProfile } from '../../../models/User';
import { getAuthenticatedUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Check authentication
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Only LP users can browse funds
    if (user.role !== 'LP') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (user.status !== 'APPROVED') {
      return res.status(403).json({ error: 'Account not approved' });
    }

    // Parse query parameters
    const {
      page = 1,
      limit = 12,
      search,
      fundType,
      riskLevel,
      minAUM,
      maxAUM,
      minReturn,
      jurisdiction,
    } = req.query;

    // Build filter query
    const fundQuery = {};
    const userQuery = { 
      role: 'FUND', 
      status: 'APPROVED',
      emailVerified: true 
    };

    if (search) {
      fundQuery.$or = [
        { fundName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { investmentStrategy: { $regex: search, $options: 'i' } },
      ];
    }

    if (fundType) {
      fundQuery.fundType = fundType;
    }

    if (riskLevel) {
      fundQuery.riskLevel = riskLevel;
    }

    if (jurisdiction) {
      fundQuery.jurisdiction = { $regex: jurisdiction, $options: 'i' };
    }

    if (minAUM || maxAUM) {
      fundQuery.assetsUnderManagement = {};
      if (minAUM) fundQuery.assetsUnderManagement.$gte = parseFloat(minAUM);
      if (maxAUM) fundQuery.assetsUnderManagement.$lte = parseFloat(maxAUM);
    }

    if (minReturn) {
      fundQuery.annualReturn = { $gte: parseFloat(minReturn) };
    }

    // Get approved fund users
    const approvedFundUsers = await User.find(userQuery).select('_id');
    const approvedUserIds = approvedFundUsers.map(user => user._id);

    // Add user filter to fund query
    fundQuery.userId = { $in: approvedUserIds };

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [funds, totalCount] = await Promise.all([
      FundProfile.find(fundQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      FundProfile.countDocuments(fundQuery)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      funds,
      currentPage: pageNum,
      totalPages,
      totalCount,
      hasMore: pageNum < totalPages,
    });

  } catch (error) {
    console.error('Funds API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}