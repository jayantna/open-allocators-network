import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card,CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { Link } from '@heroui/link';
import { Clock, Mail, Settings, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const PendingApprovalPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
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

      // If user is approved, redirect to appropriate page
      if (userData.status === 'APPROVED') {
        if (userData.role === 'LP') {
          router.push('/browse-funds');
        } else {
          router.push('/dashboard');
        }
        return;
      }

      // If user is rejected, they can still see this page but with different messaging
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@openallocatorsnetwork.com?subject=Account Approval Inquiry';
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  user?.status === 'PENDING' 
                    ? 'bg-orange-100' 
                    : 'bg-red-100'
                }`}>
                  {user?.status === 'PENDING' ? (
                    <Clock className={`w-10 h-10 ${
                      user?.status === 'PENDING' 
                        ? 'text-orange-500' 
                        : 'text-red-500'
                    }`} />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  )}
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.status === 'PENDING' 
                      ? 'Account Under Review' 
                      : 'Account Not Approved'
                    }
                  </h1>
                  <Chip 
                    color={user?.status === 'PENDING' ? 'warning' : 'danger'} 
                    variant="flat"
                    size="lg"
                  >
                    {user?.status} {user?.role}
                  </Chip>
                </div>
              </div>
            </CardHeader>
            
            <CardBody className="space-y-6">
              {user?.status === 'PENDING' ? (
                <>
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700">
                      Thank you for signing up with Open Allocators Network!
                    </p>
                    <p className="text-gray-600">
                      Your account is currently under review by our team. 
                      {user?.role === 'LP' 
                        ? ' As a Limited Partner, we need to verify your investor status and ensure compliance with our platform requirements.'
                        : ' As a Fund Manager, we need to verify your fund details and ensure all regulatory requirements are met.'
                      }
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Our compliance team will review your information</li>
                          <li>• We may contact you for additional documentation</li>
                          <li>• You'll receive an email notification once approved</li>
                          <li>• Typical review time is 1-3 business days</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      We'll send you an email at <strong>{user?.email}</strong> once your account is approved.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="flat"
                        color="primary"
                        startContent={<Settings className="w-4 h-4" />}
                        onClick={() => router.push('/profile')}
                      >
                        Complete Profile
                      </Button>
                      
                      <Button
                        variant="bordered"
                        startContent={<Mail className="w-4 h-4" />}
                        onClick={handleContactSupport}
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700">
                      Unfortunately, your account application was not approved.
                    </p>
                    <p className="text-gray-600">
                      This could be due to incomplete information, verification issues, 
                      or failure to meet our platform requirements.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="font-semibold text-red-900 mb-2">Next Steps</h3>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li>• Contact our support team for more information</li>
                          <li>• Review and update your profile information</li>
                          <li>• Provide any missing documentation</li>
                          <li>• Resubmit your application if eligible</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      color="primary"
                      startContent={<Mail className="w-4 h-4" />}
                      onClick={handleContactSupport}
                    >
                      Contact Support
                    </Button>
                    
                    <Button
                      variant="flat"
                      startContent={<Settings className="w-4 h-4" />}
                      onClick={() => router.push('/profile')}
                    >
                      Update Profile
                    </Button>
                  </div>
                </>
              )}

              <div className="border-t pt-6">
                <Button
                  variant="light"
                  color="danger"
                  startContent={<LogOut className="w-4 h-4" />}
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500 space-y-2">
                <p>Need help? Contact us at support@openallocatorsnetwork.com</p>
                <div className="flex justify-center space-x-4">
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PendingApprovalPage;