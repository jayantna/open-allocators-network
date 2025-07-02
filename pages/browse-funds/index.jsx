import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { Chip } from '@heroui/chip';
import { Avatar } from '@heroui/avatar';
import { Input } from '@heroui/input';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Pagination } from '@heroui/pagination';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Search, Filter, TrendingUp, DollarSign, MapPin, Phone, Mail, Globe, Users } from 'lucide-react';
import Layout from '@/components/Layout';

const BrowseFundsPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFund, setSelectedFund] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    fundType: '',
    riskLevel: '',
    minAUM: '',
    maxAUM: '',
    minReturn: '',
    jurisdiction: '',
  });

  useEffect(() => {
    checkAuth();
    fetchFunds();
  }, [currentPage, filters]);

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

      const user = await response.json();
      if (user.role !== 'LP') {
        router.push('/dashboard');
        return;
      }

      if (user.status === 'PENDING') {
        router.push('/pending-approval');
        return;
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchFunds = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });

      const response = await fetch(`/api/funds?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setFunds(data.funds);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching funds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      fundType: '',
      riskLevel: '',
      minAUM: '',
      maxAUM: '',
      minReturn: '',
      jurisdiction: '',
    });
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      case 'VERY_HIGH': return 'danger';
      default: return 'default';
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Funds</h1>
            <p className="text-gray-600">Discover top-performing crypto funds that match your investment criteria</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Search funds..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  startContent={<Search className="w-4 h-4 text-gray-400" />}
                />

                <Select
                  placeholder="Fund Type"
                  selectedKeys={filters.fundType ? [filters.fundType] : []}
                  onSelectionChange={(keys) => handleFilterChange('fundType', Array.from(keys)[0] || '')}
                >
                  {fundTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  placeholder="Risk Level"
                  selectedKeys={filters.riskLevel ? [filters.riskLevel] : []}
                  onSelectionChange={(keys) => handleFilterChange('riskLevel', Array.from(keys)[0] || '')}
                >
                  {riskLevels.map((risk) => (
                    <SelectItem key={risk.value} value={risk.value}>
                      {risk.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  placeholder="Jurisdiction"
                  value={filters.jurisdiction}
                  onChange={(e) => handleFilterChange('jurisdiction', e.target.value)}
                  startContent={<MapPin className="w-4 h-4 text-gray-400" />}
                />

                <Input
                  placeholder="Min AUM"
                  type="number"
                  value={filters.minAUM}
                  onChange={(e) => handleFilterChange('minAUM', e.target.value)}
                  startContent={<DollarSign className="w-4 h-4 text-gray-400" />}
                />

                <Input
                  placeholder="Max AUM"
                  type="number"
                  value={filters.maxAUM}
                  onChange={(e) => handleFilterChange('maxAUM', e.target.value)}
                  startContent={<DollarSign className="w-4 h-4 text-gray-400" />}
                />

                <Input
                  placeholder="Min Annual Return (%)"
                  type="number"
                  value={filters.minReturn}
                  onChange={(e) => handleFilterChange('minReturn', e.target.value)}
                  startContent={<TrendingUp className="w-4 h-4 text-gray-400" />}
                />

                <Button
                  variant="bordered"
                  onClick={clearFilters}
                  className="text-gray-600"
                >
                  Clear Filters
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">{funds.length} funds found</p>
          </div>

          {/* Funds Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {funds.map((fund) => (
              <Card
                key={fund._id}
                isPressable
                className="hover:shadow-lg transition-shadow duration-300"
                onClick={() => {
                  setSelectedFund(fund);
                  onOpen();
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        name={fund.fundName}
                        className="bg-gradient-to-r from-blue-500 to-purple-600"
                        size="md"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{fund.fundName}</h3>
                        <p className="text-sm text-gray-600">{fund.jurisdiction}</p>
                      </div>
                    </div>
                    <Chip
                      color={getRiskColor(fund.riskLevel)}
                      size="sm"
                      variant="flat"
                    >
                      {fund.riskLevel}
                    </Chip>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="space-y-4">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {fund.description || 'No description available'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">AUM</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(fund.assetsUnderManagement)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Annual Return</p>
                        <p className="font-semibold text-green-600">
                          {formatPercentage(fund.annualReturn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Management Fee</p>
                        <p className="font-semibold text-gray-900">
                          {formatPercentage(fund.managementFee)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Performance Fee</p>
                        <p className="font-semibold text-gray-900">
                          {formatPercentage(fund.performanceFee)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Minimum Investment</p>
                      <p className="font-semibold text-lg text-blue-600">
                        {formatCurrency(fund.minimumInvestment)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Chip size="sm" variant="flat" color="primary">
                        {fund.fundType?.replace('_', ' ')}
                      </Chip>
                      {fund.isAccredited && (
                        <Chip size="sm" variant="flat" color="success">
                          Accredited
                        </Chip>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                color="primary"
              />
            </div>
          )}

          {/* Fund Detail Modal */}
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
          >
            <ModalContent>
              {selectedFund && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        name={selectedFund.fundName}
                        className="bg-gradient-to-r from-blue-500 to-purple-600"
                        size="lg"
                      />
                      <div>
                        <h2 className="text-2xl font-bold">{selectedFund.fundName}</h2>
                        <p className="text-gray-600">{selectedFund.jurisdiction}</p>
                      </div>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-6">
                      {/* Description */}
                      {selectedFund.description && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">About</h3>
                          <p className="text-gray-700">{selectedFund.description}</p>
                        </div>
                      )}

                      {/* Investment Strategy */}
                      {selectedFund.investmentStrategy && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Investment Strategy</h3>
                          <p className="text-gray-700">{selectedFund.investmentStrategy}</p>
                        </div>
                      )}

                      {/* Key Metrics */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Key Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Assets Under Management</p>
                            <p className="font-bold text-xl text-gray-900">
                              {formatCurrency(selectedFund.assetsUnderManagement)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Annual Return</p>
                            <p className="font-bold text-xl text-green-600">
                              {formatPercentage(selectedFund.annualReturn)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Management Fee</p>
                            <p className="font-bold text-xl text-gray-900">
                              {formatPercentage(selectedFund.managementFee)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Performance Fee</p>
                            <p className="font-bold text-xl text-gray-900">
                              {formatPercentage(selectedFund.performanceFee)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Investment Details */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Investment Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Minimum Investment:</span>
                            <span className="font-semibold">{formatCurrency(selectedFund.minimumInvestment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fund Type:</span>
                            <span className="font-semibold">{selectedFund.fundType?.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Risk Level:</span>
                            <Chip color={getRiskColor(selectedFund.riskLevel)} size="sm">
                              {selectedFund.riskLevel}
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                        <div className="space-y-3">
                          {selectedFund.contactPerson && (
                            <div className="flex items-center space-x-3">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{selectedFund.contactPerson}</span>
                            </div>
                          )}
                          {selectedFund.contactEmail && (
                            <div className="flex items-center space-x-3">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{selectedFund.contactEmail}</span>
                            </div>
                          )}
                          {selectedFund.contactPhone && (
                            <div className="flex items-center space-x-3">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{selectedFund.contactPhone}</span>
                            </div>
                          )}
                          {selectedFund.website && (
                            <div className="flex items-center space-x-3">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <a
                                href={selectedFund.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                {selectedFund.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="bordered" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                      onPress={() => {
                        // Contact fund logic
                        if (selectedFund.contactEmail) {
                          window.location.href = `mailto:${selectedFund.contactEmail}?subject=Investment Inquiry - ${selectedFund.fundName}`;
                        }
                      }}
                    >
                      Contact Fund
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default BrowseFundsPage;