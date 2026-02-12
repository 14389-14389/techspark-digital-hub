import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Image, 
  MessageSquare, 
  Wrench,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Calendar,
  ArrowUpRight,
  Camera,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { getDashboardStats, getAllContacts, getAllGalleryImages } from '../../services/admin';
import { DashboardStats as StatsType, Contact, GalleryImage } from '../../types/admin';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { admin, logout } = useAdmin();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [recentUploads, setRecentUploads] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeGreeting, setTimeGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting('Good Morning');
    else if (hour < 18) setTimeGreeting('Good Afternoon');
    else setTimeGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch stats
      const statsResult = await getDashboardStats();
      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      // Fetch recent contacts
      const contactsResult = await getAllContacts(0, 5);
      if (contactsResult.success) {
        setRecentContacts(contactsResult.data.contacts);
      }

      // Fetch recent gallery uploads
      const galleryResult = await getAllGalleryImages();
      if (galleryResult.success) {
        setRecentUploads(galleryResult.images.slice(0, 5));
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats?.counts.contacts || 0,
      icon: MessageSquare,
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-500',
      trend: '+12%',
      link: '/admin/contacts'
    },
    {
      title: 'Gallery Images',
      value: stats?.counts.gallery_images || 0,
      icon: Image,
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-500',
      trend: '+8%',
      link: '/admin/gallery'
    },
    {
      title: 'Service Requests',
      value: stats?.counts.service_requests || 0,
      icon: Wrench,
      color: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-500',
      trend: '+5%',
      link: '/admin/services'
    },
    {
      title: 'Total Quotes',
      value: stats?.counts.quotes || 0,
      icon: TrendingUp,
      color: 'from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-500',
      trend: '+15%',
      link: '/admin/quotes'
    }
  ];

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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-KE', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/30 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold">
                  Dashboard
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  {new Date().toLocaleDateString('en-KE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{timeGreeting},</p>
                <p className="text-xs text-muted-foreground">{admin?.full_name || 'Admin'}</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {admin?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <Link to={stat.link}>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                      {stat.trend}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="text-2xl font-display font-semibold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  
                  {/* Hover Indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Recent Contacts</h2>
                  <p className="text-xs text-muted-foreground">Latest inquiries from clients</p>
                </div>
              </div>
              <Link 
                to="/admin/contacts"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start gap-4 p-4 bg-background/50 rounded-xl hover:bg-background/80 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium truncate">{contact.name}</h3>
                        <span className={`text-[10px] px-2 py-1 rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{contact.subject}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
                        <span>{contact.email}</span>
                        <span>•</span>
                        <span>{formatDate(contact.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No contacts yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Gallery Uploads */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Image className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Recent Uploads</h2>
                  <p className="text-xs text-muted-foreground">Latest gallery additions</p>
                </div>
              </div>
              <Link 
                to="/admin/gallery"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                Manage Gallery
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {recentUploads.length > 0 ? (
                recentUploads.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-background/50"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs font-medium text-white drop-shadow-lg line-clamp-1">
                        {image.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-white/80">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {image.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {image.likes}
                        </span>
                      </div>
                    </div>
                    {image.featured && (
                      <div className="absolute top-2 right-2">
                        <Sparkles className="h-3 w-3 text-yellow-500 drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Camera className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                  <Link
                    to="/admin/gallery/upload"
                    className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                  >
                    Upload your first image
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Link
            to="/admin/gallery/upload"
            className="group relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-all"
          >
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Upload Images</p>
                <p className="text-xs text-muted-foreground">Add to gallery</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/contacts"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/40 transition-all"
          >
            <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">View Contacts</p>
                <p className="text-xs text-muted-foreground">{stats?.counts.contacts || 0} unread</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/services"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-all"
          >
            <div className="absolute inset-0 bg-purple-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Wrench className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Service Requests</p>
                <p className="text-xs text-muted-foreground">Pending repairs</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="group relative overflow-hidden bg-gradient-to-br from-gray-500/10 to-gray-500/5 border border-gray-500/20 rounded-xl p-4 hover:border-gray-500/40 transition-all"
          >
            <div className="absolute inset-0 bg-gray-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-gray-500/20 rounded-lg">
                <Users className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin Settings</p>
                <p className="text-xs text-muted-foreground">Profile & security</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;