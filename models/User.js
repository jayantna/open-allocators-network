import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['LP', 'FUND'],
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: function() {
      return this.role === 'FUND' ? 'APPROVED' : 'PENDING';
    }
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const FundProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fundName: {
    type: String,
    required: true,
  },
  jurisdiction: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  website: String,
  contactPerson: String,
  contactEmail: String,
  contactPhone: String,
  
  // Investment Details
  managementFee: {
    type: Number,
    min: 0,
    max: 100, // Percentage
  },
  performanceFee: {
    type: Number,
    min: 0,
    max: 100, // Percentage
  },
  assetsUnderManagement: {
    type: Number,
    min: 0,
  },
  minimumInvestment: {
    type: Number,
    min: 0,
  },
  annualReturn: {
    type: Number,
  },
  fundType: {
    type: String,
    enum: ['HEDGE_FUND', 'VENTURE_CAPITAL', 'PRIVATE_EQUITY', 'CRYPTO_FUND', 'OTHER'],
    default: 'CRYPTO_FUND'
  },
  investmentStrategy: String,
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'],
    default: 'HIGH'
  },
  
  // Compliance
  registrationNumber: String,
  regulatoryBody: String,
  isAccredited: {
    type: Boolean,
    default: false,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const LPProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  company: String,
  investorType: {
    type: String,
    enum: ['FAMILY_OFFICE', 'HNWI', 'FUND_OF_FUNDS', 'INSTITUTIONAL', 'OTHER'],
    required: true,
  },
  investmentCapacity: {
    type: Number,
    min: 0,
  },
  preferredRiskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'],
  },
  investmentHorizon: String,
  interests: [String],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  console.log(candidatePassword, this.password, 'passwwwoorrddss')
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamps
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

FundProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

LPProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const FundProfile = mongoose.models.FundProfile || mongoose.model('FundProfile', FundProfileSchema);
export const LPProfile = mongoose.models.LPProfile || mongoose.model('LPProfile', LPProfileSchema);