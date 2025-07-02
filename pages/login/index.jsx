import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { Link } from '@heroui/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Layout from '@/components/Layout';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Redirect based on user role and status
        if (data.user.status === 'PENDING') {
          router.push('/pending-approval');
        } else if (data.user.role === 'LP') {
          router.push('/browse-funds');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrors({ submit: data.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
        <div className="max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="w-full p-8">
            <CardHeader className="text-center pb-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your Open Allocators Network account</p>
              </div>
            </CardHeader>
            
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  isRequired
                />
                
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password}
                  startContent={<Lock className="w-4 h-4 text-gray-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  isRequired
                />

                <div className="flex items-center justify-between">
                  <Checkbox
                    isSelected={formData.rememberMe}
                    onValueChange={(checked) => handleInputChange('rememberMe', checked)}
                    size="sm"
                  >
                    <span className="text-sm text-gray-600">Remember me</span>
                  </Checkbox>
                  
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
                  isLoading={loading}
                  isDisabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    New to crypto investments?
                  </p>
                  <div className="space-y-2">
                    <Link 
                      href="/signup?role=LP" 
                      className="block text-sm text-blue-600 hover:text-blue-700"
                    >
                      Join as Limited Partner →
                    </Link>
                    <Link 
                      href="/signup?role=FUND" 
                      className="block text-sm text-purple-600 hover:text-purple-700"
                    >
                      Register your Fund →
                    </Link>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Trust indicators */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-4">
              Trusted by 1000+ investors and funds worldwide
            </p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <div className="text-xs text-gray-400">🔒 Bank-level Security</div>
              <div className="text-xs text-gray-400">✓ KYC Verified</div>
              <div className="text-xs text-gray-400">🛡️ Compliance Ready</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;