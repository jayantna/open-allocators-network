import { useState } from 'react';
import { useRouter } from 'next/router';
import { Link } from '@heroui/link';
import { Card,CardBody,CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import Link from '@heroui/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Layout from '@/components/Layout';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="w-full">
            <CardHeader className="text-center pb-6">
              <div className="space-y-2">
                {!submitted ? (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
                    <p className="text-gray-600">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
                    <p className="text-gray-600">
                      If an account with that email exists, we've sent you a password reset link.
                    </p>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardBody>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    isInvalid={!!error}
                    errorMessage={error}
                    startContent={<Mail className="w-4 h-4 text-gray-400" />}
                    isRequired
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
                    isLoading={loading}
                    isDisabled={loading}
                    startContent={!loading && <Send className="w-4 h-4" />}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Email sent!</strong> Check your inbox and click the link in the email to reset your password.
                    </p>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    <p>Didn't receive the email? Check your spam folder or try again in a few minutes.</p>
                  </div>

                  <Button
                    variant="flat"
                    color="primary"
                    className="w-full"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                  >
                    Try Different Email
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Don't have an account?
                  </p>
                  <div className="space-y-2">
                    <Link 
                      href="/signup?role=LP" 
                      className="block text-sm text-blue-600 hover:text-blue-700"
                    >
                      Sign up as Limited Partner →
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

          {/* Help section */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-4">
              Need help? Contact us at support@openallocatorsnetwork.com
            </p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <div className="text-xs text-gray-400">🔒 Secure</div>
              <div className="text-xs text-gray-400">✓ Trusted</div>
              <div className="text-xs text-gray-400">🛡️ Protected</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;