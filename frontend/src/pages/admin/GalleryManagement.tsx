import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Image, 
  ChevronLeft,
  Trash2,
  Edit,
  Eye,
  Heart,
  Calendar,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { getAllGalleryImages, deleteGalleryImage, updateGalleryImage } from '../../services/admin';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  subcategory: string | null;
  featured: boolean;
  views: number;
  likes: number;
  uploaded_at: string;
}

const GalleryManagement = () => {
  const navigate = useNavigate();
  const { admin } = useAdmin();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    featured: false
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cctv', label: 'CCTV & Security' },
    { value: 'development', label: 'Web & Mobile Development' },
    { value: 'repairs', label: 'Repairs & Maintenance' },
    { value: 'network', label: 'IT & Network' },
    { value: 'consultancy', label: 'Consultancy' }
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const result = await getAllGalleryImages();
    if (result.success) {
      setImages(result.images);
    }
    setLoading(false);
  };

  const handleDelete = async (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const result = await deleteGalleryImage(imageId);
      if (result.success) {
        setImages(images.filter(img => img.id !== imageId));
      } else {
        alert('Failed to delete image');
      }
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setEditForm({
      title: image.title,
      description: image.description || '',
      featured: image.featured
    });
  };

  const handleUpdate = async () => {
    if (!editingImage) return;
    
    const result = await updateGalleryImage(editingImage.id, {
      title: editForm.title,
      description: editForm.description || null,
      featured: editForm.featured
    });

    if (result.success) {
      setImages(images.map(img => 
        img.id === editingImage.id 
          ? { ...img, ...editForm }
          : img
      ));
      setEditingImage(null);
    } else {
      alert('Failed to update image');
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (categoryValue: string) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat?.label || categoryValue;
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
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold">
                  Gallery Management
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage all your project images
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/gallery/upload')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Upload New
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Filters */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <button
                onClick={fetchImages}
                className="p-2.5 bg-background border border-border/50 rounded-lg hover:bg-card/50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <RefreshCw className="h-8 w-8 text-primary/40 animate-spin" />
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/30">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
              <Image className="h-16 w-16 text-primary/30 mx-auto mb-4 relative" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">No images found</p>
            <button
              onClick={() => navigate('/admin/gallery/upload')}
              className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
            >
              <Plus className="h-3 w-3" />
              Upload your first image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-background/50">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-full text-2xs border border-border/30">
                      {getCategoryLabel(image.category)}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {image.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-2xs text-white">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {image.title}
                  </h3>
                  
                  {image.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {image.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-3xs text-muted-foreground/70">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {image.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {image.likes}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(image.uploaded_at)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border/50 rounded-2xl max-w-lg w-full p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Edit Image</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Featured Image</p>
                      <p className="text-xs text-muted-foreground">Show at the top of gallery</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.featured}
                      onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-background border border-border/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/30">
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingImage(null)}
                  className="flex-1 px-4 py-2.5 bg-background border border-border/50 text-sm font-medium rounded-lg hover:bg-card/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GalleryManagement;