import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (!token) return;
    
    // Validate token format (optional client-side check)
    if (typeof token !== 'string' || token.length < 10) {
      setErrors({ token: 'Invalid reset token' });
    }
  }, [token]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!token) {
      setErrors({ token: 'Reset token is missing' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setErrors({ submit: data.error || 'Failed to reset password' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="w-full">
              <CardBody className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
                <p className="text-gray-600 mb-6">
                  This password reset link is invalid or has expired.
                </p>
                <Button
                  as={Link}
                  href="/forgot-password"
                  color="primary"
                  variant="flat"
                >
                  Request New Reset Link
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="w-full">
            <CardHeader className="text-center pb-6">
              <div className="space-y-2">
                {!success ? (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-gray-600">
                      Enter your new password below.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Password Reset</h1>
                    <p className="text-gray-600">
                      Your password has been successfully reset!
                    </p>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardBody>
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    label="New Password"
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    isInvalid={!!errors.newPassword}
                    errorMessage={errors.newPassword}
                    startContent={<Lock className="w-4 h-4 text-gray-400" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    isRequired
                  />
                  
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword}
                    startContent={<Lock className="w-4 h-4 text-gray-400" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    isRequired
                  />

                  {(errors.submit || errors.token) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm text-center">
                        {errors.submit || errors.token}
                      </p>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <p className="font-medium mb-1">Password requirements:</p>
                    <ul className="text-xs space-y-1">
                      <li className={formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        • At least 8 characters
                      </li>
                      <li className={formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : 'text-gray-500'}>
                        • Passwords match
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm text-center">
                      <strong>Success!</strong> Your password has been reset. You will be redirected to the login page in a few seconds.
                    </p>
                  </div>
                  
                  <Button
                    as={Link}
                    href="/login"
                    color="primary"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    size="lg"
                  >
                    Continue to Login
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Back to Login
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Security notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-4">
              For your security, this reset link will expire after use
            </p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <div className="text-xs text-gray-400">🔒 Encrypted</div>
              <div className="text-xs text-gray-400">✓ Secure</div>
              <div className="text-xs text-gray-400">🛡️ Protected</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;