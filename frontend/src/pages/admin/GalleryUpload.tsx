import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image, 
  X, 
  ChevronLeft,
  Camera,
  Sparkles,
  Info
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import api from '../../services/api';

const GalleryUpload = () => {
  const navigate = useNavigate();
  const { admin } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_category: 'cctv',
    service_subcategory: '',
    featured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const categories = [
    { value: 'cctv', label: 'CCTV & Security' },
    { value: 'development', label: 'Web & Mobile Development' },
    { value: 'repairs', label: 'Repairs & Maintenance' },
    { value: 'network', label: 'IT & Network' },
    { value: 'consultancy', label: 'Consultancy' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('service_category', formData.service_category);
      if (formData.service_subcategory) {
        formDataObj.append('service_subcategory', formData.service_subcategory);
      }
      formDataObj.append('featured', String(formData.featured));
      formDataObj.append('image', selectedFile);

      const response = await api.post('/gallery/', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
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
              <div className="p-2 bg-primary/10 rounded-xl">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold">
                  Upload to Gallery
                </h1>
                <p className="text-xs text-muted-foreground">
                  Add new project photos to showcase your work
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Project Image <span className="text-red-500">*</span>
              </label>
              <div 
                className={`
                  relative border-2 border-dashed rounded-xl p-8
                  transition-all duration-300
                  ${preview 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-border/50 hover:border-primary/30 hover:bg-primary/5'
                  }
                `}
              >
                {preview ? (
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-[300px] mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="e.g., Office CCTV Installation - Westlands"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                placeholder="Describe the project, location, equipment used, etc."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Service Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.service_category}
                onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Subcategory (Optional)
              </label>
              <input
                type="text"
                value={formData.service_subcategory}
                onChange={(e) => setFormData({ ...formData, service_subcategory: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="e.g., IP Cameras, Access Control, Smart Home"
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Featured Image</p>
                  <p className="text-xs text-muted-foreground">
                    Featured images appear at the top of the gallery
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background border border-border/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-blue-500 mb-1">Upload Information</p>
                <p className="text-xs text-muted-foreground">
                  Images will be visible immediately in the gallery. You can edit or delete them later from the gallery management page.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !selectedFile || !formData.title}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 bg-background border border-border/50 text-sm font-medium rounded-lg hover:bg-card/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default GalleryUpload;