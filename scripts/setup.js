// Setup script to create initial data and admin user
// Run with: node scripts/setup.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Import models
const { User, FundProfile, LPProfile } = require('../models/User');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create sample admin user
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@openallocatorsnetwork.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      return;
    }

    const adminUser = new User({
      email: adminEmail,
      password: 'AdminPassword123!', // Let the pre-save middleware hash it
      role: 'FUND',
      status: 'APPROVED',
      emailVerified: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created');
    console.log(`📧 Email: ${adminEmail}`);
    console.log('🔑 Password: AdminPassword123!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Create sample fund
const createSampleFund = async () => {
  try {
    const adminUser = await User.findOne({ email: 'admin@openallocatorsnetwork.com' });
    if (!adminUser) {
      console.log('⚠️ Admin user not found, skipping sample fund creation');
      return;
    }

    // Check if sample fund already exists
    const existingFund = await FundProfile.findOne({ userId: adminUser._id });
    if (existingFund) {
      console.log('ℹ️ Sample fund already exists');
      return;
    }

    const sampleFund = new FundProfile({
      userId: adminUser._id,
      fundName: 'Open Allocators Network Demo Fund',
      jurisdiction: 'Delaware, USA',
      description: 'A demonstration crypto hedge fund showcasing platform capabilities. This fund focuses on institutional-grade cryptocurrency investments with risk management strategies.',
      website: 'https://democonnect.com',
      contactPerson: 'John Smith',
      contactEmail: 'admin@openallocatorsnetwork.com',
      contactPhone: '+1 (555) 123-4567',
      managementFee: 2.0,
      performanceFee: 20.0,
      assetsUnderManagement: 50000000,
      minimumInvestment: 100000,
      annualReturn: 45.2,
      fundType: 'CRYPTO_FUND',
      investmentStrategy: 'Multi-strategy approach focusing on Bitcoin, Ethereum, and select altcoins with quantitative trading algorithms and systematic risk management.',
      riskLevel: 'HIGH',
      isAccredited: true,
    });

    await sampleFund.save();
    console.log('✅ Sample fund created');
    
  } catch (error) {
    console.error('❌ Error creating sample fund:', error);
  }
};

// Create sample LP
const createSampleLP = async () => {
  try {
    const lpEmail = 'investor@example.com';
    
    // Check if LP already exists
    const existingLP = await User.findOne({ email: lpEmail });
    if (existingLP) {
      console.log('ℹ️ Sample LP already exists');
      return;
    }

    const lpUser = new User({
      email: lpEmail,
      password: 'InvestorPassword123!', // Let the pre-save middleware hash it
      role: 'LP',
      status: 'APPROVED', // For demo purposes
      emailVerified: true,
    });

    await lpUser.save();

    const lpProfile = new LPProfile({
      userId: lpUser._id,
      firstName: 'Jane',
      lastName: 'Investor',
      company: 'Family Office LLC',
      investorType: 'FAMILY_OFFICE',
      investmentCapacity: 5000000,
      preferredRiskLevel: 'MEDIUM',
      investmentHorizon: '3-5 years',
    });

    await lpProfile.save();
    
    console.log('✅ Sample LP created');
    console.log(`📧 Email: ${lpEmail}`);
    console.log('🔑 Password: InvestorPassword123!');
    
  } catch (error) {
    console.error('❌ Error creating sample LP:', error);
  }
};

// Create database indexes for better performance
const createIndexes = async () => {
  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1, status: 1 });
    
    // Fund profile indexes
    await FundProfile.collection.createIndex({ userId: 1 }, { unique: true });
    await FundProfile.collection.createIndex({ fundType: 1, riskLevel: 1 });
    await FundProfile.collection.createIndex({ assetsUnderManagement: 1 });
    await FundProfile.collection.createIndex({ annualReturn: 1 });
    
    // LP profile indexes
    await LPProfile.collection.createIndex({ userId: 1 }, { unique: true });
    await LPProfile.collection.createIndex({ investorType: 1 });
    
    console.log('✅ Database indexes created');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

// Main setup function
const setup = async () => {
  console.log('🚀 Starting Open Allocators Network setup...\n');
  
  await connectDB();
  await createIndexes();
  await createAdminUser();
  await createSampleFund();
  await createSampleLP();
  
  console.log('\n✅ Setup completed successfully!');
  console.log('\n📋 Summary:');
  console.log('• Admin User: admin@openallocatorsnetwork.com (Password: AdminPassword123!)');
  console.log('• Sample LP: investor@example.com (Password: InvestorPassword123!)');
  console.log('• Database indexes created');
  console.log('• Sample fund and LP profile created');
  console.log('\n🌐 You can now start the development server with: npm run dev');
  
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run setup
setup();