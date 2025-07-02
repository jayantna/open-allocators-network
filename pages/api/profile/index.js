import dbConnect from '../../../lib/mongodb';
import { User, FundProfile, LPProfile } from '../../../models/User';
import { getAuthenticatedUser } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.method === 'GET') {
    return handleGetProfile(req, res, user);
  } else if (req.method === 'PUT') {
    return handleUpdateProfile(req, res, user);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetProfile(req, res, user) {
  try {
    let profile;

    if (user.role === 'FUND') {
      profile = await FundProfile.findOne({ userId: user._id }).lean();
    } else if (user.role === 'LP') {
      profile = await LPProfile.findOne({ userId: user._id }).lean();
    }

    if (!profile) {
      // Create empty profile if it doesn't exist
      if (user.role === 'FUND') {
        profile = new FundProfile({ userId: user._id });
        await profile.save();
      } else {
        profile = new LPProfile({ userId: user._id });
        await profile.save();
      }
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleUpdateProfile(req, res, user) {
  try {
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    let profile;

    if (user.role === 'FUND') {
      // Validate required fields for funds
      const requiredFields = ['fundName', 'jurisdiction', 'contactPerson'];
      for (const field of requiredFields) {
        if (!updateData[field]?.trim()) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      // Convert numeric fields
      if (updateData.managementFee !== undefined) {
        updateData.managementFee = updateData.managementFee ? parseFloat(updateData.managementFee) : undefined;
      }
      if (updateData.performanceFee !== undefined) {
        updateData.performanceFee = updateData.performanceFee ? parseFloat(updateData.performanceFee) : undefined;
      }
      if (updateData.assetsUnderManagement !== undefined) {
        updateData.assetsUnderManagement = updateData.assetsUnderManagement ? parseFloat(updateData.assetsUnderManagement) : undefined;
      }
      if (updateData.minimumInvestment !== undefined) {
        updateData.minimumInvestment = updateData.minimumInvestment ? parseFloat(updateData.minimumInvestment) : undefined;
      }
      if (updateData.annualReturn !== undefined) {
        updateData.annualReturn = updateData.annualReturn ? parseFloat(updateData.annualReturn) : undefined;
      }

      profile = await FundProfile.findOneAndUpdate(
        { userId: user._id },
        { ...updateData, updatedAt: new Date() },
        { new: true, upsert: true }
      );
    } else if (user.role === 'LP') {
      // Validate required fields for LPs
      const requiredFields = ['firstName', 'lastName', 'investorType'];
      for (const field of requiredFields) {
        if (!updateData[field]?.trim()) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      // Convert numeric fields
      if (updateData.investmentCapacity !== undefined) {
        updateData.investmentCapacity = updateData.investmentCapacity ? parseFloat(updateData.investmentCapacity) : undefined;
      }

      profile = await LPProfile.findOneAndUpdate(
        { userId: user._id },
        { ...updateData, updatedAt: new Date() },
        { new: true, upsert: true }
      );
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate field value' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}