import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Eye, 
  Calendar,
  LayoutGrid,
  Code2,
  Wrench,
  Network,
  Headset,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  getGalleryCategories, 
  getGalleryImages, 
  likeGalleryImage,
  getGalleryImageById 
} from "../services/gallery";
import { GalleryImage, GalleryCategory, ServiceCategory } from "../types/gallery";

// Category icons mapping
const categoryIcons = {
  LayoutGrid,
  Code2,
  Wrench,
  Camera,
  Network,
  Headset,
  Sparkles
};

// Category labels
const categoryLabels: Record<ServiceCategory, string> = {
  all: "All Services",
  development: "Web & Mobile Development",
  repairs: "Repairs & Maintenance",
  cctv: "CCTV & Security",
  network: "IT & Network",
  consultancy: "Consultancy"
};

// Category icon names
const categoryIconNames: Record<ServiceCategory, string> = {
  all: "LayoutGrid",
  development: "Code2",
  repairs: "Wrench",
  cctv: "Camera",
  network: "Network",
  consultancy: "Headset"
};

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getGalleryCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  // Load images when category changes
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const imgs = await getGalleryImages(selectedCategory);
      setImages(imgs);
      setLoading(false);
    };
    fetchImages();
  }, [selectedCategory]);

  const handleLike = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    const likes = await likeGalleryImage(imageId);
    if (likes !== null) {
      setImages(images.map(img => 
        img.id === imageId ? { ...img, likes } : img
      ));
      if (selectedImage?.id === imageId) {
        setSelectedImage({ ...selectedImage, likes });
      }
    }
  };

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length 
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get category icon component
  const getCategoryIcon = (categoryName: ServiceCategory) => {
    const iconName = categoryIconNames[categoryName];
    const Icon = categoryIcons[iconName as keyof typeof categoryIcons] || Camera;
    return Icon;
  };

  // Get category label
  const getCategoryLabel = (categoryName: ServiceCategory) => {
    return categoryLabels[categoryName] || categoryName;
  };

  return (
    <section id="gallery" className="section-padding border-t border-border/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-2">
            <Camera className="h-3 w-3" />
            Our Work
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Project <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light">
            Browse through our completed projects and see the quality of our work across different services
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || LayoutGrid;
              const isSelected = selectedCategory === category.name;
              
              return (
                <motion.button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium
                    transition-all duration-300 overflow-hidden group
                    ${isSelected 
                      ? 'text-white' 
                      : 'text-muted-foreground hover:text-foreground bg-card/30 hover:bg-card/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-primary"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    {category.label}
                    {category.image_count > 0 && (
                      <span className={`
                        text-xs px-1.5 py-0.5 rounded-full
                        ${isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary/10 text-primary'
                        }
                      `}>
                        {category.image_count}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <Camera className="h-12 w-12 text-primary/40 animate-pulse" />
            </div>
          </div>
        ) : images.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
              <Camera className="h-16 w-16 text-primary/30 mx-auto mb-4 relative" />
            </div>
            <p className="text-sm text-muted-foreground">No images in this category yet</p>
            <p className="text-xs text-muted-foreground/70 mt-2">Check back soon for updates</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {images.map((image, index) => {
                const CategoryIcon = getCategoryIcon(image.service_category);
                
                return (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-card/30 rounded-xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-pointer"
                    onClick={() => openLightbox(image, index)}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full text-2xs font-medium border border-border/30">
                          <CategoryIcon className="h-3 w-3 text-primary" />
                          {getCategoryLabel(image.service_category)}
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
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-display text-sm font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {image.title}
                      </h3>
                      
                      {image.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {image.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-3xs text-muted-foreground/70">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {image.views}
                          </span>
                          <button 
                            onClick={(e) => handleLike(e, image.id)}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors group/like"
                          >
                            <Heart className={`
                              h-3 w-3 
                              ${image.likes > 0 ? 'fill-red-500 text-red-500' : ''} 
                              group-hover/like:scale-110 transition-transform
                            `} />
                            {image.likes}
                          </button>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(image.uploaded_at)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative max-w-6xl w-full max-h-[90vh] flex flex-col lg:flex-row bg-card rounded-2xl overflow-hidden border border-border/50"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Navigation buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigateImage('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image */}
                <div className="lg:w-2/3 bg-black/5 dark:bg-black/20 flex items-center justify-center p-2">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain max-h-[80vh] lg:max-h-[90vh]"
                  />
                </div>

                {/* Details */}
                <div className="lg:w-1/3 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Category */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = getCategoryIcon(selectedImage.service_category);
                        return <Icon className="h-4 w-4 text-primary" />;
                      })()}
                      <span className="text-xs font-medium px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                        {getCategoryLabel(selectedImage.service_category)}
                      </span>
                      {selectedImage.featured && (
                        <span className="text-xs px-3 py-1.5 bg-primary text-white rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h2 className="text-2xl font-display font-semibold mb-2">
                        {selectedImage.title}
                      </h2>
                      {selectedImage.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedImage.description}
                        </p>
                      )}
                    </div>

                    {/* Subcategory */}
                    {selectedImage.service_subcategory && (
                      <div className="p-4 bg-card/50 rounded-lg border border-border/30">
                        <p className="text-2xs text-muted-foreground uppercase tracking-wider mb-1">
                          Service Type
                        </p>
                        <p className="text-sm font-medium capitalize">
                          {selectedImage.service_subcategory.replace(/-/g, ' ')}
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/30">
                      <div className="text-center">
                        <Eye className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                        <p className="text-lg font-semibold">{selectedImage.views}</p>
                        <p className="text-3xs text-muted-foreground">Views</p>
                      </div>
                      <div className="text-center">
                        <button 
                          onClick={(e) => handleLike(e, selectedImage.id)}
                          className="group/like inline-block"
                        >
                          <Heart className={`
                            h-4 w-4 mx-auto mb-1 transition-all
                            ${selectedImage.likes > 0 ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} 
                            group-hover/like:scale-110
                          `} />
                        </button>
                        <p className="text-lg font-semibold">{selectedImage.likes}</p>
                        <p className="text-3xs text-muted-foreground">Likes</p>
                      </div>
                      <div className="text-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                        <p className="text-xs font-medium">{formatDate(selectedImage.uploaded_at)}</p>
                        <p className="text-3xs text-muted-foreground">Uploaded</p>
                      </div>
                    </div>

                    {/* Service inquiry */}
                    <div className="bg-primary/5 rounded-lg p-4">
                      <p className="text-xs font-medium mb-2">Interested in this service?</p>
                      <a
                        href="#contact"
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                        onClick={closeLightbox}
                      >
                        Request Similar Project
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GallerySection;