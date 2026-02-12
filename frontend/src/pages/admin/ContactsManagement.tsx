import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  ChevronLeft,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Calendar,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { getAllContacts, updateContactStatus } from '../../services/admin';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
}

const ContactsManagement = () => {
  const navigate = useNavigate();
  const { admin } = useAdmin();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const result = await getAllContacts(0, 100);
    if (result.success) {
      setContacts(result.data.contacts);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    const result = await updateContactStatus(contactId, newStatus);
    if (result.success) {
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: newStatus as any }
          : contact
      ));
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus as any });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'read': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      case 'replied': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'closed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
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

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
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
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold">
                  Contact Management
                </h1>
                <p className="text-xs text-muted-foreground">
                  View and manage all client inquiries
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {contacts.length} contacts
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {selectedContact ? (
          // Contact Detail View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <button
              onClick={() => setSelectedContact(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Contacts
            </button>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">{selectedContact.name}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedContact.email}
                      </span>
                      {selectedContact.phone && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {selectedContact.phone}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Received</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(selectedContact.created_at)}
                  </p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Subject</p>
                  <p className="text-sm font-medium">{selectedContact.subject}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs text-muted-foreground mb-3">Message</p>
                <div className="p-6 bg-background/50 rounded-xl">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-3">Update Status</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'read')}
                    disabled={selectedContact.status === 'read'}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500/10 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="h-4 w-4" />
                    Mark as Read
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'replied')}
                    disabled={selectedContact.status === 'replied'}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'closed')}
                    disabled={selectedContact.status === 'closed'}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="h-4 w-4" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Contacts List View
          <>
            {/* Filters */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
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
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={fetchContacts}
                    className="p-2.5 bg-background border border-border/50 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contacts Grid */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  <RefreshCw className="h-8 w-8 text-primary/40 animate-spin" />
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/30">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl" />
                  <Mail className="h-16 w-16 text-blue-500/30 mx-auto mb-4 relative" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">No contacts found</p>
                <p className="text-xs text-muted-foreground/70">Contact form submissions will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedContact(contact)}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{contact.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {contact.phone}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(contact.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="pl-14">
                      <p className="text-sm font-medium mb-1">{contact.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {contact.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ContactsManagement;