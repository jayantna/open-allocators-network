import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { Select, SelectItem } from '@heroui/select';
import { Eye, EyeOff, Mail, Lock, User, Building, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';

const SignupPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [step, setStep] = useState(1); // 1: role selection, 2: basic info, 3: profile details, 4: OTP
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',

    // Fund specific fields
    fundName: '',
    jurisdiction: '',
    description: '',
    website: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    managementFee: '',
    performanceFee: '',
    assetsUnderManagement: '',
    minimumInvestment: '',
    annualReturn: '',
    fundType: 'CRYPTO_FUND',
    investmentStrategy: '',
    riskLevel: 'HIGH',

    // LP specific fields
    firstName: '',
    lastName: '',
    company: '',
    investorType: '',
    investmentCapacity: '',
    preferredRiskLevel: 'MEDIUM',
    investmentHorizon: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if role is provided in query params
    if (router.query.role) {
      setFormData(prev => ({ ...prev, role: router.query.role }));
      setStep(2);
    }
  }, [router.query]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.role) newErrors.role = 'Please select a role';
    }

    if (step === 2) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 3 && formData.role === 'FUND') {
      if (!formData.fundName) newErrors.fundName = 'Fund name is required';
      if (!formData.jurisdiction) newErrors.jurisdiction = 'Jurisdiction is required';
      if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
    }

    if (step === 3 && formData.role === 'LP') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.investorType) newErrors.investorType = 'Investor type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 3) {
        handleSignup();
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4);
        onOpen();
      } else {
        setErrors({ submit: data.error || 'Signup failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/profile');
      } else {
        setOtpError(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setOtpError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'LP',
      title: 'Limited Partner',
      description: 'Family Office, HNWI, or Fund of Funds',
      icon: <User className="w-8 h-8" />,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      value: 'FUND',
      title: 'Fund Manager',
      description: 'Crypto Fund or Investment Manager',
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const investorTypes = [
    { value: 'FAMILY_OFFICE', label: 'Family Office' },
    { value: 'HNWI', label: 'High Net Worth Individual' },
    { value: 'FUND_OF_FUNDS', label: 'Fund of Funds' },
    { value: 'INSTITUTIONAL', label: 'Institutional Investor' },
    { value: 'OTHER', label: 'Other' }
  ];

  const fundTypes = [
    { value: 'CRYPTO_FUND', label: 'Crypto Fund' },
    { value: 'HEDGE_FUND', label: 'Hedge Fund' },
    { value: 'VENTURE_CAPITAL', label: 'Venture Capital' },
    { value: 'PRIVATE_EQUITY', label: 'Private Equity' },
    { value: 'OTHER', label: 'Other' }
  ];

  const riskLevels = [
    { value: 'LOW', label: 'Low Risk' },
    { value: 'MEDIUM', label: 'Medium Risk' },
    { value: 'HIGH', label: 'High Risk' },
    { value: 'VERY_HIGH', label: 'Very High Risk' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${step >= stepNumber
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <span className="text-sm text-gray-600">
                Step {step} of 4: {
                  step === 1 ? 'Choose Role' :
                    step === 2 ? 'Account Details' :
                      step === 3 ? 'Profile Information' :
                        'Email Verification'
                }
              </span>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <Card className="max-w-4xl mx-auto p-8 content-center">
              <CardHeader className="text-center pb-6">
                <div className='flex flex-col'>
                  <h1 className="text-3xl font-bold text-gray-900">Join Open Allocators Network</h1>
                  <p className="text-gray-600 mt-2">Choose your role to get started</p>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roleOptions.map((role) => (
                    <Card
                      key={role.value}
                      isPressable
                      className={`p-6 border-2 transition-all duration-300 hover:shadow-lg ${formData.role === role.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => handleInputChange('role', role.value)}
                    >
                      <CardBody className="text-center space-y-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${role.gradient} flex items-center justify-center text-white mx-auto`}>
                          {role.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                        <p className="text-gray-600">{role.description}</p>
                      </CardBody>
                    </Card>
                  ))}
                </div>

                {errors.role && (
                  <p className="text-red-500 text-sm text-center">{errors.role}</p>
                )}

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  onClick={handleNext}
                  isDisabled={!formData.role}
                >
                  Continue
                </Button>
              </CardBody>
            </Card>
          )}

          {/* Step 2: Basic Account Information */}
          {step === 2 && (
            <Card className="max-w-lg mx-auto">
              <CardHeader className="text-center pb-6">
                <h1 className="text-3xl font-bold text-gray-900">Account Details</h1>
                <p className="text-gray-600 mt-2">Create your secure account</p>
              </CardHeader>
              <CardBody className="space-y-6">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
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
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword}
                  startContent={<Lock className="w-4 h-4 text-gray-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <div className="flex justify-between gap-4">
                  <Button
                    variant="bordered"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    onClick={handleNext}
                  >
                    Continue
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Step 3: Profile Information */}
          {step === 3 && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center pb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {formData.role === 'FUND' ? 'Fund Information' : 'Profile Information'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {formData.role === 'FUND'
                    ? 'Tell us about your fund'
                    : 'Complete your investor profile'
                  }
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                {formData.role === 'FUND' ? (
                  // Fund Profile Fields
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Fund Name"
                      placeholder="Enter fund name"
                      value={formData.fundName}
                      onChange={(e) => handleInputChange('fundName', e.target.value)}
                      isInvalid={!!errors.fundName}
                      errorMessage={errors.fundName}
                      className="md:col-span-2"
                    />

                    <Input
                      label="Jurisdiction"
                      placeholder="e.g., Delaware, Cayman Islands"
                      value={formData.jurisdiction}
                      onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                      isInvalid={!!errors.jurisdiction}
                      errorMessage={errors.jurisdiction}
                    />

                    <Input
                      label="Contact Person"
                      placeholder="Fund manager name"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      isInvalid={!!errors.contactPerson}
                      errorMessage={errors.contactPerson}
                    />

                    <Input
                      label="Contact Email"
                      placeholder="contact@fund.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />

                    <Input
                      label="Website"
                      placeholder="https://yourfund.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />

                    <Input
                      label="Management Fee (%)"
                      type="number"
                      placeholder="2.0"
                      value={formData.managementFee}
                      onChange={(e) => handleInputChange('managementFee', e.target.value)}
                    />

                    <Input
                      label="Performance Fee (%)"
                      type="number"
                      placeholder="20.0"
                      value={formData.performanceFee}
                      onChange={(e) => handleInputChange('performanceFee', e.target.value)}
                    />

                    <Input
                      label="AUM (USD)"
                      type="number"
                      placeholder="10000000"
                      value={formData.assetsUnderManagement}
                      onChange={(e) => handleInputChange('assetsUnderManagement', e.target.value)}
                    />

                    <Input
                      label="Minimum Investment (USD)"
                      type="number"
                      placeholder="100000"
                      value={formData.minimumInvestment}
                      onChange={(e) => handleInputChange('minimumInvestment', e.target.value)}
                    />

                    <Input
                      label="Annual Return (%)"
                      type="number"
                      placeholder="25.5"
                      value={formData.annualReturn}
                      onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                    />

                    <Select
                      label="Fund Type"
                      placeholder="Select fund type"
                      selectedKeys={formData.fundType ? [formData.fundType] : []}
                      onSelectionChange={(keys) => handleInputChange('fundType', Array.from(keys)[0])}
                    >
                      {fundTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Risk Level"
                      placeholder="Select risk level"
                      selectedKeys={formData.riskLevel ? [formData.riskLevel] : []}
                      onSelectionChange={(keys) => handleInputChange('riskLevel', Array.from(keys)[0])}
                    >
                      {riskLevels.map((risk) => (
                        <SelectItem key={risk.value} value={risk.value}>
                          {risk.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Textarea
                      label="Investment Strategy"
                      placeholder="Describe your investment strategy"
                      value={formData.investmentStrategy}
                      onChange={(e) => handleInputChange('investmentStrategy', e.target.value)}
                      className="md:col-span-2"
                    />

                    <Textarea
                      label="Fund Description"
                      placeholder="Brief description of your fund"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="md:col-span-2"
                    />
                  </div>
                ) : (
                  // LP Profile Fields
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      isInvalid={!!errors.firstName}
                      errorMessage={errors.firstName}
                    />

                    <Input
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      isInvalid={!!errors.lastName}
                      errorMessage={errors.lastName}
                    />

                    <Input
                      label="Company/Organization"
                      placeholder="Enter company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="md:col-span-2"
                    />

                    <Select
                      label="Investor Type"
                      placeholder="Select investor type"
                      selectedKeys={formData.investorType ? [formData.investorType] : []}
                      onSelectionChange={(keys) => handleInputChange('investorType', Array.from(keys)[0])}
                      isInvalid={!!errors.investorType}
                      errorMessage={errors.investorType}
                      className="md:col-span-2"
                    >
                      {investorTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Investment Capacity (USD)"
                      type="number"
                      placeholder="1000000"
                      value={formData.investmentCapacity}
                      onChange={(e) => handleInputChange('investmentCapacity', e.target.value)}
                    />

                    <Select
                      label="Preferred Risk Level"
                      placeholder="Select risk preference"
                      selectedKeys={formData.preferredRiskLevel ? [formData.preferredRiskLevel] : []}
                      onSelectionChange={(keys) => handleInputChange('preferredRiskLevel', Array.from(keys)[0])}
                    >
                      {riskLevels.map((risk) => (
                        <SelectItem key={risk.value} value={risk.value}>
                          {risk.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Investment Horizon"
                      placeholder="e.g., 3-5 years"
                      value={formData.investmentHorizon}
                      onChange={(e) => handleInputChange('investmentHorizon', e.target.value)}
                      className="md:col-span-2"
                    />
                  </div>
                )}

                {errors.submit && (
                  <p className="text-red-500 text-sm text-center">{errors.submit}</p>
                )}

                <div className="flex justify-between gap-4">
                  <Button
                    variant="bordered"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    onClick={handleNext}
                    isLoading={loading}
                  >
                    Create Account
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* OTP Verification Modal */}
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={false}
            hideCloseButton
            size="md"
          >
            <ModalContent>
              <ModalHeader className="text-center">
                <div className="w-full text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                  <p className="text-gray-600 mt-2">
                    We've sent a 6-digit code to {formData.email}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError('');
                  }}
                  maxLength={6}
                  isInvalid={!!otpError}
                  errorMessage={otpError}
                  className="text-center text-2xl font-mono"
                />
              </ModalBody>
              <ModalFooter className="flex-col space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  onClick={handleVerifyOTP}
                  isLoading={loading}
                  isDisabled={!otp || otp.length !== 6}
                >
                  Verify Email
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => {
                    // Resend OTP logic here
                  }}
                >
                  Didn't receive the code? Resend
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;