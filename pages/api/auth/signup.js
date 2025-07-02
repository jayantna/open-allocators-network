import dbConnect from '../../../lib/mongodb';
import { User, FundProfile, LPProfile } from '../../../models/User';
import { generateOTP, sendVerificationEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const {
      email,
      password,
      role,
      // Fund fields
      fundName,
      jurisdiction,
      description,
      website,
      contactPerson,
      contactEmail,
      contactPhone,
      managementFee,
      performanceFee,
      assetsUnderManagement,
      minimumInvestment,
      annualReturn,
      fundType,
      investmentStrategy,
      riskLevel,
      // LP fields
      firstName,
      lastName,
      company,
      investorType,
      investmentCapacity,
      preferredRiskLevel,
      investmentHorizon,
    } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    if (!['LP', 'FUND'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      role,
      emailVerificationToken: otp,
      emailVerificationExpires: otpExpires,
    });

    await user.save();

    // Create profile based on role
    if (role === 'FUND') {
      const fundProfile = new FundProfile({
        userId: user._id,
        fundName: fundName || '',
        jurisdiction: jurisdiction || '',
        description: description || '',
        website: website || '',
        contactPerson: contactPerson || '',
        contactEmail: contactEmail || email,
        contactPhone: contactPhone || '',
        managementFee: managementFee ? parseFloat(managementFee) : undefined,
        performanceFee: performanceFee ? parseFloat(performanceFee) : undefined,
        assetsUnderManagement: assetsUnderManagement ? parseFloat(assetsUnderManagement) : undefined,
        minimumInvestment: minimumInvestment ? parseFloat(minimumInvestment) : undefined,
        annualReturn: annualReturn ? parseFloat(annualReturn) : undefined,
        fundType: fundType || 'CRYPTO_FUND',
        investmentStrategy: investmentStrategy || '',
        riskLevel: riskLevel || 'HIGH',
      });

      await fundProfile.save();
    } else if (role === 'LP') {
      const lpProfile = new LPProfile({
        userId: user._id,
        firstName: firstName || '',
        lastName: lastName || '',
        company: company || '',
        investorType: investorType || '',
        investmentCapacity: investmentCapacity ? parseFloat(investmentCapacity) : undefined,
        preferredRiskLevel: preferredRiskLevel || 'MEDIUM',
        investmentHorizon: investmentHorizon || '',
      });

      await lpProfile.save();
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, otp);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail the signup, just log the error
    }

    res.status(201).json({
      message: 'User created successfully. Please check your email for verification code.',
      userId: user._id,
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}