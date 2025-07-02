import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Tab, Tabs } from '@heroui/tabs';
import { Divider } from '@heroui/divider';
import { Input, Textarea } from '@heroui/input';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';
import { Card,CardBody } from '@heroui/card';
import { Select, SelectItem } from '@heroui/select';
import { Avatar } from '@heroui/avatar';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/Layout';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    checkAuth();
    fetchProfile();
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

      if (userData.status === 'PENDING') {
        router.push('/pending-approval');
        return;
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (user?.role === 'FUND') {
      if (!profileData.fundName?.trim()) {
        newErrors.fundName = 'Fund name is required';
      }
      if (!profileData.jurisdiction?.trim()) {
        newErrors.jurisdiction = 'Jurisdiction is required';
      }
      if (!profileData.contactPerson?.trim()) {
        newErrors.contactPerson = 'Contact person is required';
      }
    } else if (user?.role === 'LP') {
      if (!profileData.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!profileData.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!profileData.investorType) {
        newErrors.investorType = 'Investor type is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setProfileData(updatedProfile);
        setErrors({ success: 'Profile updated successfully!' });
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setErrors({ success: 'Password changed successfully!' });
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to change password' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <Avatar
                name={user?.email}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
                size="lg"
                icon={<User />}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600">{user?.email}</p>
                <Chip 
                  color={user?.status === 'APPROVED' ? 'success' : 'warning'} 
                  size="sm"
                  className="mt-1"
                >
                  {user?.status} {user?.role}
                </Chip>
              </div>
            </div>
          </div>

          <Card>
            <CardBody>
              <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={setActiveTab}
                variant="underlined"
                classNames={{
                  tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                  cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-600",
                  tab: "max-w-fit px-0 h-12",
                }}
              >
                <Tab key="profile" title={
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile Information</span>
                  </div>
                }>
                  <div className="py-6">
                    {/* Success/Error Messages */}
                    {errors.success && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600">{errors.success}</p>
                      </div>
                    )}
                    
                    {errors.submit && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{errors.submit}</p>
                      </div>
                    )}

                    {user?.role === 'FUND' ? (
                      // Fund Profile Form
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            label="Fund Name"
                            placeholder="Enter fund name"
                            value={profileData.fundName || ''}
                            onChange={(e) => handleProfileInputChange('fundName', e.target.value)}
                            isInvalid={!!errors.fundName}
                            errorMessage={errors.fundName}
                            className="md:col-span-2"
                            isRequired
                          />
                          
                          <Input
                            label="Jurisdiction"
                            placeholder="e.g., Delaware, Cayman Islands"
                            value={profileData.jurisdiction || ''}
                            onChange={(e) => handleProfileInputChange('jurisdiction', e.target.value)}
                            isInvalid={!!errors.jurisdiction}
                            errorMessage={errors.jurisdiction}
                            isRequired
                          />
                          
                          <Input
                            label="Contact Person"
                            placeholder="Fund manager name"
                            value={profileData.contactPerson || ''}
                            onChange={(e) => handleProfileInputChange('contactPerson', e.target.value)}
                            isInvalid={!!errors.contactPerson}
                            errorMessage={errors.contactPerson}
                            isRequired
                          />
                          
                          <Input
                            label="Contact Email"
                            placeholder="contact@fund.com"
                            value={profileData.contactEmail || ''}
                            onChange={(e) => handleProfileInputChange('contactEmail', e.target.value)}
                          />
                          
                          <Input
                            label="Contact Phone"
                            placeholder="+1 (555) 123-4567"
                            value={profileData.contactPhone || ''}
                            onChange={(e) => handleProfileInputChange('contactPhone', e.target.value)}
                          />
                          
                          <Input
                            label="Website"
                            placeholder="https://yourfund.com"
                            value={profileData.website || ''}
                            onChange={(e) => handleProfileInputChange('website', e.target.value)}
                          />
                          
                          <Input
                            label="Management Fee (%)"
                            type="number"
                            placeholder="2.0"
                            value={profileData.managementFee || ''}
                            onChange={(e) => handleProfileInputChange('managementFee', e.target.value)}
                          />
                          
                          <Input
                            label="Performance Fee (%)"
                            type="number"
                            placeholder="20.0"
                            value={profileData.performanceFee || ''}
                            onChange={(e) => handleProfileInputChange('performanceFee', e.target.value)}
                          />
                          
                          <Input
                            label="Assets Under Management (USD)"
                            type="number"
                            placeholder="10000000"
                            value={profileData.assetsUnderManagement || ''}
                            onChange={(e) => handleProfileInputChange('assetsUnderManagement', e.target.value)}
                          />
                          
                          <Input
                            label="Minimum Investment (USD)"
                            type="number"
                            placeholder="100000"
                            value={profileData.minimumInvestment || ''}
                            onChange={(e) => handleProfileInputChange('minimumInvestment', e.target.value)}
                          />
                          
                          <Input
                            label="Annual Return (%)"
                            type="number"
                            placeholder="25.5"
                            value={profileData.annualReturn || ''}
                            onChange={(e) => handleProfileInputChange('annualReturn', e.target.value)}
                          />
                          
                          <Select
                            label="Fund Type"
                            placeholder="Select fund type"
                            selectedKeys={profileData.fundType ? [profileData.fundType] : []}
                            onSelectionChange={(keys) => handleProfileInputChange('fundType', Array.from(keys)[0])}
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
                            selectedKeys={profileData.riskLevel ? [profileData.riskLevel] : []}
                            onSelectionChange={(keys) => handleProfileInputChange('riskLevel', Array.from(keys)[0])}
                          >
                            {riskLevels.map((risk) => (
                              <SelectItem key={risk.value} value={risk.value}>
                                {risk.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        
                        <Textarea
                          label="Investment Strategy"
                          placeholder="Describe your investment strategy"
                          value={profileData.investmentStrategy || ''}
                          onChange={(e) => handleProfileInputChange('investmentStrategy', e.target.value)}
                          minRows={3}
                        />
                        
                        <Textarea
                          label="Fund Description"
                          placeholder="Brief description of your fund"
                          value={profileData.description || ''}
                          onChange={(e) => handleProfileInputChange('description', e.target.value)}
                          minRows={3}
                        />
                      </div>
                    ) : (
                      // LP Profile Form
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            label="First Name"
                            placeholder="Enter first name"
                            value={profileData.firstName || ''}
                            onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                            isInvalid={!!errors.firstName}
                            errorMessage={errors.firstName}
                            isRequired
                          />
                          
                          <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={profileData.lastName || ''}
                            onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                            isInvalid={!!errors.lastName}
                            errorMessage={errors.lastName}
                            isRequired
                          />
                          
                          <Input
                            label="Company/Organization"
                            placeholder="Enter company name"
                            value={profileData.company || ''}
                            onChange={(e) => handleProfileInputChange('company', e.target.value)}
                            className="md:col-span-2"
                          />
                          
                          <Select
                            label="Investor Type"
                            placeholder="Select investor type"
                            selectedKeys={profileData.investorType ? [profileData.investorType] : []}
                            onSelectionChange={(keys) => handleProfileInputChange('investorType', Array.from(keys)[0])}
                            isInvalid={!!errors.investorType}
                            errorMessage={errors.investorType}
                            className="md:col-span-2"
                            isRequired
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
                            value={profileData.investmentCapacity || ''}
                            onChange={(e) => handleProfileInputChange('investmentCapacity', e.target.value)}
                          />
                          
                          <Select
                            label="Preferred Risk Level"
                            placeholder="Select risk preference"
                            selectedKeys={profileData.preferredRiskLevel ? [profileData.preferredRiskLevel] : []}
                            onSelectionChange={(keys) => handleProfileInputChange('preferredRiskLevel', Array.from(keys)[0])}
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
                            value={profileData.investmentHorizon || ''}
                            onChange={(e) => handleProfileInputChange('investmentHorizon', e.target.value)}
                            className="md:col-span-2"
                          />
                        </div>
                      </div>
                    )}

                    <Divider className="my-6" />
                    
                    <div className="flex justify-end">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        onClick={handleSaveProfile}
                        isLoading={saving}
                        startContent={<Save className="w-4 h-4" />}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Tab>

                <Tab key="password" title={
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </div>
                }>
                  <div className="py-6">
                    {/* Success/Error Messages */}
                    {errors.success && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600">{errors.success}</p>
                      </div>
                    )}
                    
                    {errors.submit && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{errors.submit}</p>
                      </div>
                    )}

                    <div className="max-w-md space-y-6">
                      <Input
                        type={showPasswords.current ? "text" : "password"}
                        label="Current Password"
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                        isInvalid={!!errors.currentPassword}
                        errorMessage={errors.currentPassword}
                        endContent={
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                        isRequired
                      />
                      
                      <Input
                        type={showPasswords.new ? "text" : "password"}
                        label="New Password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                        isInvalid={!!errors.newPassword}
                        errorMessage={errors.newPassword}
                        endContent={
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                        isRequired
                      />
                      
                      <Input
                        type={showPasswords.confirm ? "text" : "password"}
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                        isInvalid={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword}
                        endContent={
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                        isRequired
                      />
                    </div>

                    <Divider className="my-6" />
                    
                    <div className="flex justify-end">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        onClick={handleChangePassword}
                        isLoading={saving}
                        startContent={<Lock className="w-4 h-4" />}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;