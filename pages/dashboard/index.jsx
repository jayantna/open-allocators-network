import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { Progress } from '@heroui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Settings, 
  PlusCircle,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import Layout from '@/components/Layout';

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const userData = await response.json();
      setUser(userData);

      if (userData.role !== 'FUND') {
        router.push('/browse-funds');
        return;
      }

      if (userData.status === 'PENDING') {
        router.push('/pending-approval');
        return;
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch profile data
      const profileResponse = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      }

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0%';
    return `${value.toFixed(1)}%`;
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    
    const requiredFields = [
      'fundName', 'jurisdiction', 'contactPerson', 'description',
      'managementFee', 'performanceFee', 'assetsUnderManagement',
      'minimumInvestment', 'investmentStrategy'
    ];
    
    const completedFields = requiredFields.filter(field => 
      profile[field] !== null && profile[field] !== undefined && profile[field] !== ''
    );
    
    return (completedFields.length / requiredFields.length) * 100;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar
                  name={profile?.fundName || user?.email}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                  size="lg"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile?.fundName || 'Fund Dashboard'}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <Chip color="success" size="sm" className="mt-1">
                    {user?.status} FUND
                  </Chip>
                </div>
              </div>
              <Button
                color="primary"
                variant="flat"
                startContent={<Settings className="w-4 h-4" />}
                onClick={() => router.push('/profile')}
              >
                Manage Profile
              </Button>
            </div>
          </div>

          {/* Profile Completeness Alert */}
          {getProfileCompleteness() < 100 && (
            <Card className="mb-8 border-l-4 border-l-warning-500 bg-warning-50">
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-warning-800 mb-2">
                      Complete Your Profile
                    </h3>
                    <p className="text-warning-700 mb-3">
                      Complete your fund profile to increase visibility to potential investors.
                    </p>
                    <Progress 
                      value={getProfileCompleteness()} 
                      color="warning"
                      className="mb-3"
                    />
                    <p className="text-sm text-warning-600">
                      {Math.round(getProfileCompleteness())}% complete
                    </p>
                  </div>
                  <Button
                    color="warning"
                    variant="flat"
                    size="sm"
                    onClick={() => router.push('/profile')}
                  >
                    Complete Profile
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Assets Under Management</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(profile?.assetsUnderManagement)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Annual Return</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPercentage(profile?.annualReturn)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.profileViews || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Interested Investors</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.interestedInvestors || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fund Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900">Fund Overview</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {profile?.description ? (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">{profile.description}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <PlusCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Add a fund description to attract investors</p>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="mt-3"
                        onClick={() => router.push('/profile')}
                      >
                        Add Description
                      </Button>
                    </div>
                  )}

                  {profile?.investmentStrategy && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Investment Strategy</h3>
                      <p className="text-gray-700">{profile.investmentStrategy}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Management Fee</p>
                      <p className="font-semibold text-lg">{formatPercentage(profile?.managementFee)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Performance Fee</p>
                      <p className="font-semibold text-lg">{formatPercentage(profile?.performanceFee)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Minimum Investment</p>
                      <p className="font-semibold text-lg">{formatCurrency(profile?.minimumInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jurisdiction</p>
                      <p className="font-semibold text-lg">{profile?.jurisdiction || 'Not specified'}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Activity will appear here once investors start viewing your fund
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="flat"
                    startContent={<Settings className="w-4 h-4" />}
                    onClick={() => router.push('/profile')}
                  >
                    Edit Fund Profile
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="flat"
                    startContent={<Eye className="w-4 h-4" />}
                    onClick={() => {
                      // Preview fund profile logic
                      window.open('/browse-funds', '_blank');
                    }}
                  >
                    Preview Fund Listing
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="flat"
                    startContent={<BarChart3 className="w-4 h-4" />}
                    isDisabled
                  >
                    View Analytics (Coming Soon)
                  </Button>
                </CardBody>
              </Card>

              {/* Fund Status */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold text-gray-900">Fund Status</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <Chip color="success" size="sm">Approved</Chip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Profile Completeness</span>
                    <span className="font-semibold">{Math.round(getProfileCompleteness())}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Visibility</span>
                    <Chip 
                      color={getProfileCompleteness() >= 80 ? "success" : "warning"} 
                      size="sm"
                    >
                      {getProfileCompleteness() >= 80 ? "High" : "Low"}
                    </Chip>
                  </div>
                </CardBody>
              </Card>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold text-gray-900">Performance Summary</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-lg text-gray-900">
                      {formatPercentage(profile?.annualReturn)}
                    </p>
                    <p className="text-sm text-gray-600">Annual Return</p>
                  </div>
                  
                  {profile?.annualReturn && profile.annualReturn > 0 && (
                    <div className="text-center pt-4 border-t">
                      <p className="text-sm text-green-600 font-medium">
                        {profile.annualReturn > 20 ? 'Exceptional' : 
                         profile.annualReturn > 10 ? 'Strong' : 'Moderate'} Performance
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;