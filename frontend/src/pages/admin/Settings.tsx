import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  ChevronLeft,
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  Calendar
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import api from '../../services/api';
import { Admin } from '../../types/admin';

const Settings = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setProfileForm({
        full_name: admin.full_name || '',
        email: admin.email || ''
      });
    }
  }, [admin]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('full_name', profileForm.full_name);
      formData.append('email', profileForm.email);

      const response = await api.put('/admin/settings/profile', formData);
      
      if (response.data) {
        setSuccess('Profile updated successfully!');
        // Update admin in context would be nice here
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (passwordForm.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/admin/settings/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      
      if (response.data) {
        setSuccess('Password changed successfully!');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
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
              <div className="p-2 bg-gray-500/10 rounded-xl">
                <SettingsIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold">
                  Admin Settings
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage your profile and security
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-4xl mx-auto">
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex items-start gap-3"
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">{success}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/30">
            <div className="p-3 bg-primary/10 rounded-xl">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Profile Information</h2>
              <p className="text-xs text-muted-foreground">
                Update your personal information
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
        >
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/30">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Lock className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="text-xs text-muted-foreground">
                Change your password
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-xs font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  Minimum 8 characters
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </form>

          {/* Admin Info */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
              <Shield className="h-5 w-5 text-primary/50" />
              <div className="flex-1">
                <p className="text-xs font-medium">Account Security</p>
                <p className="text-2xs text-muted-foreground">
                  Last login: {admin?.last_login ? new Date(admin.last_login).toLocaleString('en-KE') : 'Never'}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;