# Open Allocators Network - Crypto Fund Connector Platform

A comprehensive web application connecting Limited Partners, Family Offices, and HNWIs with top-tier crypto funds. Built with Next.js, Hero UI, Tailwind CSS, and MongoDB.

## 🚀 Features

### For Limited Partners (LPs)
- **Browse Funds**: Discover and filter crypto funds by various criteria
- **Detailed Fund Profiles**: View comprehensive fund information, performance metrics, and contact details
- **Investment Matching**: Find funds that match your risk tolerance and investment capacity
- **Secure Communication**: Direct contact with fund managers

### For Fund Managers
- **Fund Dashboard**: Comprehensive overview of fund performance and investor interest
- **Profile Management**: Manage fund details, investment strategy, and contact information
- **Investor Visibility**: Showcase your fund to qualified investors
- **Performance Tracking**: Monitor profile views and investor engagement

### Security & Compliance
- **Email OTP Verification**: Secure account verification process
- **Role-based Access Control**: Separate interfaces for LPs and Funds
- **Account Approval System**: Manual approval for LPs, automatic for Funds
- **Password Security**: Bcrypt encryption and secure password reset

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Hero UI, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens, bcrypt password hashing
- **Email**: Nodemailer for OTP verification
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crypto-fund-connector.git
cd crypto-fund-connector
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment variables template and configure:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/crypto-fund-connector
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@openallocatorsnetwork.com
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The app will create the database automatically

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Email Configuration

For email OTP verification, configure SMTP settings:

#### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

### 6. Run the Application

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
crypto-fund-connector/
├── components/           # Reusable React components
│   └── Layout.jsx       # Main layout component
├── lib/                 # Utility libraries
│   ├── auth.js         # Authentication utilities
│   ├── email.js        # Email sending utilities
│   └── mongodb.js      # Database connection
├── models/             # Database models
│   └── User.js         # User, FundProfile, LPProfile models
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   │   ├── auth/       # Authentication routes
│   │   ├── dashboard/  # Dashboard data
│   │   ├── funds/      # Fund-related endpoints
│   │   └── profile/    # Profile management
│   ├── browse-funds.jsx # Fund browsing page (LP)
│   ├── dashboard.jsx    # Fund dashboard (Fund)
│   ├── index.jsx        # Home page
│   ├── login.jsx        # Login page
│   ├── pending-approval.jsx # Pending approval page
│   ├── profile.jsx      # Profile management
│   ├── signup.jsx       # Signup with role selection
│   └── _app.jsx         # Next.js app configuration
├── styles/
│   └── globals.css      # Global styles and Tailwind
├── .env.local.example   # Environment variables template
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # This file
```

## 🔐 Authentication Flow

### User Registration
1. User selects role (LP or Fund)
2. Provides email and password
3. Completes profile information
4. Receives OTP via email
5. Verifies email with OTP
6. Account created with appropriate status:
   - **LPs**: PENDING (requires manual approval)
   - **Funds**: APPROVED (automatic approval)

### Login Process
1. User provides email and password
2. System verifies credentials
3. Generates JWT token
4. Redirects based on role and status

## 🎭 User Roles & Permissions

### Limited Partner (LP)
- **Status**: PENDING by default, requires approval
- **Access**: Browse funds, manage profile, contact funds
- **Restrictions**: Cannot access fund dashboard

### Fund Manager (FUND)
- **Status**: APPROVED by default
- **Access**: Fund dashboard, profile management, view analytics
- **Restrictions**: Cannot browse other funds

## 🗄️ Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: 'LP' | 'FUND',
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  emailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Fund Profiles Collection
```javascript
{
  userId: ObjectId (ref: User),
  fundName: String,
  jurisdiction: String,
  description: String,
  website: String,
  contactPerson: String,
  contactEmail: String,
  contactPhone: String,
  managementFee: Number,
  performanceFee: Number,
  assetsUnderManagement: Number,
  minimumInvestment: Number,
  annualReturn: Number,
  fundType: 'CRYPTO_FUND' | 'HEDGE_FUND' | 'VENTURE_CAPITAL' | 'PRIVATE_EQUITY' | 'OTHER',
  investmentStrategy: String,
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH',
  // ... additional fields
}
```

### LP Profiles Collection
```javascript
{
  userId: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  company: String,
  investorType: 'FAMILY_OFFICE' | 'HNWI' | 'FUND_OF_FUNDS' | 'INSTITUTIONAL' | 'OTHER',
  investmentCapacity: Number,
  preferredRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH',
  investmentHorizon: String,
  interests: [String],
  // ... additional fields
}
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `styles/globals.css` for global styles
- Hero UI components can be themed using the built-in theming system

### Features
- Add new fields to user models
- Implement additional filters for fund browsing
- Add analytics and reporting features
- Integrate payment processing for investments

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Funds
- `GET /api/funds` - Browse funds (with filtering)
- `GET /api/funds/[id]` - Get specific fund details

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Other Platforms
- **Netlify**: Configure build settings and environment variables
- **Railway**: Deploy with built-in database options
- **AWS/DigitalOcean**: Use PM2 for process management

### Production Checklist
- [ ] Configure secure JWT secret
- [ ] Set up production MongoDB instance
- [ ] Configure SMTP for production email
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Review and test all security measures

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@openallocatorsnetwork.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues](https://github.com/your-username/crypto-fund-connector/issues)

## 🔮 Roadmap

### Planned Features
- [ ] Advanced analytics dashboard
- [ ] Document management system
- [ ] Investment tracking
- [ ] Video conferencing integration
- [ ] Mobile application
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] Advanced matching algorithms
- [ ] Compliance reporting tools
- [ ] Integration with major crypto exchanges

### Version History
- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Enhanced fund filtering and search
- **v1.2.0** - Dashboard improvements and analytics

---

Built with ❤️ for the crypto investment community