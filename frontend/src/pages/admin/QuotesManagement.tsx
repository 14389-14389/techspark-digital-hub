import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ChevronLeft,
  Search,
  Filter,
  RefreshCw,
  User,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Camera,
  Code2,
  Wrench,
  Wifi,
  Headset
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_category: string;
  project_description: string;
  budget_range: string | null;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  quoted_amount: number | null;
  created_at: string;
}

const QuotesManagement = () => {
  const navigate = useNavigate();
  const { admin } = useAdmin();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    // TODO: Implement getQuotes API
    setQuotes([]);
    setLoading(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cctv': return Camera;
      case 'development': return Code2;
      case 'repairs': return Wrench;
      case 'network': return Wifi;
      case 'consultancy': return Headset;
      default: return TrendingUp;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'quoted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'accepted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmitQuote = async () => {
    if (!selectedQuote || !quoteAmount) return;
    // TODO: Implement updateQuote API
    alert('Quote API coming soon!');
  };

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
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold">
                  Quote Requests
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage client quote requests
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {quotes.length} quotes
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {selectedQuote ? (
          // Quote Detail View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <button
              onClick={() => setSelectedQuote(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quotes
            </button>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                    {(() => {
                      const Icon = getCategoryIcon(selectedQuote.service_category);
                      return <Icon className="h-8 w-8 text-orange-500" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">{selectedQuote.name}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedQuote.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedQuote.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuote.status)}`}>
                  {selectedQuote.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Service Category</p>
                  <p className="text-sm font-medium capitalize">{selectedQuote.service_category}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                  <p className="text-sm font-medium">{selectedQuote.budget_range || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Requested</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(selectedQuote.created_at)}
                  </p>
                </div>
                {selectedQuote.quoted_amount && (
                  <div className="p-4 bg-green-500/5 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Quoted Amount</p>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                      KES {selectedQuote.quoted_amount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <p className="text-xs text-muted-foreground mb-3">Project Description</p>
                <div className="p-6 bg-background/50 rounded-xl">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedQuote.project_description}
                  </p>
                </div>
              </div>

              {selectedQuote.status === 'pending' && (
                <div className="border-t border-border/30 pt-6">
                  <p className="text-xs text-muted-foreground mb-4">Submit Quote</p>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-2">Quote Amount (KES)</label>
                      <input
                        type="number"
                        placeholder="e.g., 25000"
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <button
                      onClick={handleSubmitQuote}
                      disabled={!quoteAmount}
                      className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send Quote
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search quote requests..."
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
                    <option value="quoted">Quoted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={fetchQuotes}
                    className="p-2.5 bg-background border border-border/50 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quotes Grid */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  <RefreshCw className="h-8 w-8 text-primary/40 animate-spin" />
                </div>
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/30">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-3xl" />
                  <TrendingUp className="h-16 w-16 text-orange-500/30 mx-auto mb-4 relative" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">No quote requests yet</p>
                <p className="text-xs text-muted-foreground/70">Client quote requests will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {quotes.map((quote) => {
                  const Icon = getCategoryIcon(quote.service_category);
                  return (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedQuote(quote)}
                      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">{quote.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {quote.email}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {quote.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(quote.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="pl-14">
                        <p className="text-sm mb-2">
                          <span className="font-medium capitalize">{quote.service_category}</span>
                          {quote.budget_range && ` • Budget: ${quote.budget_range}`}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {quote.project_description}
                        </p>
                        {quote.quoted_amount && (
                          <div className="flex items-center gap-2 mt-3">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              KES {quote.quoted_amount.toLocaleString()}
                            </span>
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

export default QuotesManagement;