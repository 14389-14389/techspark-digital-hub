import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  ChevronLeft,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  User,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Smartphone,
  Laptop,
  Printer,
  Camera,
  Wifi
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { getAllServiceRequests, updateServiceRequestStatus } from '../../services/admin';

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  device_type: string | null;
  brand: string | null;
  model: string | null;
  issue_description: string;
  status: 'pending' | 'diagnosing' | 'repairing' | 'completed' | 'collected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimated_cost: number | null;
  estimated_days: number | null;
  created_at: string;
}

const ServicesManagement = () => {
  const navigate = useNavigate();
  const { admin } = useAdmin();
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    estimated_cost: '',
    estimated_days: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    console.log('🔍 Fetching service requests...');
    const result = await getAllServiceRequests();
    console.log('📦 API Response:', result);
    
    if (result.success) {
      console.log(`✅ Found ${result.requests.length} service requests`);
      setServices(result.requests);
    } else {
      console.error('❌ Failed to fetch:', result.error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (requestId: string, status: string) => {
    const result = await updateServiceRequestStatus(
      requestId, 
      status,
      editForm.estimated_cost ? parseFloat(editForm.estimated_cost) : undefined,
      editForm.estimated_days ? parseInt(editForm.estimated_days) : undefined
    );
    
    if (result.success) {
      setServices(services.map(service => 
        service.id === requestId 
          ? { 
              ...service, 
              status: status as any,
              estimated_cost: editForm.estimated_cost ? parseFloat(editForm.estimated_cost) : service.estimated_cost,
              estimated_days: editForm.estimated_days ? parseInt(editForm.estimated_days) : service.estimated_days
            }
          : service
      ));
      if (selectedService?.id === requestId) {
        setSelectedService({ 
          ...selectedService, 
          status: status as any,
          estimated_cost: editForm.estimated_cost ? parseFloat(editForm.estimated_cost) : selectedService.estimated_cost,
          estimated_days: editForm.estimated_days ? parseInt(editForm.estimated_days) : selectedService.estimated_days
        });
      }
      setEditForm({ status: '', estimated_cost: '', estimated_days: '' });
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'laptop': return Laptop;
      case 'smartphone': return Smartphone;
      case 'tablet': return Smartphone;
      case 'printer': return Printer;
      case 'cctv': return Camera;
      case 'network': return Wifi;
      default: return Wrench;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'diagnosing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'repairing': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'collected': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
      case 'normal': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ FIXED FILTER - Now it actually works!
  const filteredServices = services.filter(service => {
    // If no search term and filters are 'all', show all services
    const matchesSearch = searchTerm === '' ? true : 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.issue_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.device_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : service.status === statusFilter;
    const matchesType = typeFilter === 'all' ? true : service.service_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/30 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-card/80 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Wrench className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold">
                  Service Requests
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage repairs and service requests
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {services.length} requests
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {selectedService ? (
          // Service Detail View (keep as is)
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* ... rest of detail view code (keep unchanged) ... */}
            <button
              onClick={() => setSelectedService(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Service Requests
            </button>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                    {(() => {
                      const Icon = getServiceIcon(selectedService.service_type);
                      return <Icon className="h-8 w-8 text-purple-500" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">{selectedService.name}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedService.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedService.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getPriorityColor(selectedService.priority)}`}>
                    {selectedService.priority.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedService.status)}`}>
                    {selectedService.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Service Type</p>
                  <p className="text-sm font-medium capitalize">{selectedService.service_type}</p>
                  {selectedService.device_type && (
                    <p className="text-xs text-muted-foreground mt-1">{selectedService.device_type}</p>
                  )}
                </div>
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Device</p>
                  <p className="text-sm font-medium">
                    {selectedService.brand || 'N/A'} {selectedService.model || ''}
                  </p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Received</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(selectedService.created_at)}
                  </p>
                </div>
              </div>

              {/* Issue Description */}
              <div className="mb-8">
                <p className="text-xs text-muted-foreground mb-3">Issue Description</p>
                <div className="p-6 bg-background/50 rounded-xl">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedService.issue_description}
                  </p>
                </div>
              </div>

              {/* Estimation */}
              {(selectedService.estimated_cost || selectedService.estimated_days) && (
                <div className="mb-8 p-6 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-4">Estimation</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {selectedService.estimated_cost && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
                        <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                          KES {selectedService.estimated_cost.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedService.estimated_days && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Estimated Time</p>
                        <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                          {selectedService.estimated_days} days
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Update Status Form */}
              <div className="border-t border-border/30 pt-6">
                <p className="text-xs text-muted-foreground mb-4">Update Service Status</p>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-medium mb-2">Estimated Cost (KES)</label>
                    <input
                      type="number"
                      placeholder="e.g., 3500"
                      value={editForm.estimated_cost}
                      onChange={(e) => setEditForm({ ...editForm, estimated_cost: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2">Estimated Days</label>
                    <input
                      type="number"
                      placeholder="e.g., 2"
                      value={editForm.estimated_days}
                      onChange={(e) => setEditForm({ ...editForm, estimated_days: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedService.id, 'diagnosing')}
                    disabled={selectedService.status === 'diagnosing'}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Diagnosing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedService.id, 'repairing')}
                    disabled={selectedService.status === 'repairing'}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wrench className="h-4 w-4" />
                    Repairing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedService.id, 'completed')}
                    disabled={selectedService.status === 'completed'}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedService.id, 'collected')}
                    disabled={selectedService.status === 'collected'}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500/10 text-gray-700 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="h-4 w-4" />
                    Collected
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Services List View
          <>
            {/* Filters */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search service requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="diagnosing">Diagnosing</option>
                    <option value="repairing">Repairing</option>
                    <option value="completed">Completed</option>
                    <option value="collected">Collected</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="laptop">Laptop</option>
                    <option value="smartphone">Smartphone</option>
                    <option value="tablet">Tablet</option>
                    <option value="printer">Printer</option>
                    <option value="cctv">CCTV</option>
                    <option value="network">Network</option>
                  </select>
                  <button
                    onClick={fetchServices}
                    className="p-2.5 bg-background border border-border/50 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  <RefreshCw className="h-8 w-8 text-primary/40 animate-spin" />
                </div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/30">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl" />
                  <Wrench className="h-16 w-16 text-purple-500/30 mx-auto mb-4 relative" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {services.length === 0 ? 'No service requests found' : 'No matching service requests'}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {services.length === 0 
                    ? 'Client repair requests will appear here' 
                    : 'Try clearing your search filters'}
                </p>
                {services.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                    className="mt-4 text-xs text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredServices.map((service) => {
                  const Icon = getServiceIcon(service.service_type);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedService(service)}
                      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium">{service.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(service.priority)}`}>
                                {service.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {service.email}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {service.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(service.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="pl-14">
                        <p className="text-sm mb-2">
                          <span className="font-medium capitalize">{service.device_type || service.service_type}</span>
                          {service.brand && ` - ${service.brand}`}
                          {service.model && ` ${service.model}`}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.issue_description}
                        </p>
                        {(service.estimated_cost || service.estimated_days) && (
                          <div className="flex items-center gap-4 mt-3 text-xs">
                            {service.estimated_cost && (
                              <span className="text-green-600 dark:text-green-400">
                                KES {service.estimated_cost.toLocaleString()}
                              </span>
                            )}
                            {service.estimated_days && (
                              <span className="text-green-600 dark:text-green-400">
                                ~{service.estimated_days} days
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ServicesManagement;