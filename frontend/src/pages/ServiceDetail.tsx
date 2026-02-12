import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Code2, 
  Server, 
  ShieldCheck, 
  Headset,
  Camera,
  Wrench,
  Wifi,
  Laptop,
  Smartphone,
  Printer,
  Tablet,
  Cpu,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Heart,
  Calendar,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { getGalleryImages } from '../services/gallery';
import { GalleryImage, ServiceCategory } from '../types/gallery';

// Map service titles to gallery categories
const serviceToCategory: Record<string, ServiceCategory> = {
  // Development & IT
  "Web & Mobile Apps": "development",
  "IT & Network Management": "network",
  "Cybersecurity": "consultancy",
  "Support & Consultancy": "consultancy",
  
  // Repair Services
  "Laptop Repair": "repairs",
  "Smartphone Repair": "repairs",
  "Tablet & iPad Repair": "repairs",
  "Printer Repair": "repairs",
  "Computer Repair": "repairs",
  
  // CCTV & Security
  "CCTV Installation": "cctv",
  "Network Setup": "network",
  
  // Add more as needed
  "Web Development": "development",
  "Mobile App Development": "development",
  "iPhone Repair": "repairs",
  "Samsung Repair": "repairs",
  "Access Control": "cctv",
  "Smart Home": "cctv"
};

// Map service titles to icons
const serviceIconMap: Record<string, any> = {
  "Web & Mobile Apps": Code2,
  "IT & Network Management": Server,
  "Cybersecurity": ShieldCheck,
  "Support & Consultancy": Headset,
  "Laptop Repair": Laptop,
  "Smartphone Repair": Smartphone,
  "Tablet & iPad Repair": Tablet,
  "Printer Repair": Printer,
  "Computer Repair": Cpu,
  "CCTV Installation": Camera,
  "Network Setup": Wifi,
  "Web Development": Code2,
  "Mobile App Development": Smartphone,
  "iPhone Repair": Smartphone,
  "Samsung Repair": Smartphone,
  "Access Control": Camera,
  "Smart Home": Camera
};

// Map service titles to descriptions
const serviceDescription: Record<string, string> = {
  "Web & Mobile Apps": "Custom applications built with modern architectures, tailored to your business workflows.",
  "IT & Network Management": "Proactive monitoring and optimization ensuring your infrastructure runs at peak performance.",
  "Cybersecurity": "Comprehensive security assessments and penetration testing to protect your digital assets.",
  "Support & Consultancy": "Dedicated technical guidance to navigate your digital transformation with confidence.",
  "Laptop Repair": "Professional laptop repair including screen replacement, battery issues, motherboard repair, and virus removal.",
  "Smartphone Repair": "Expert smartphone repair for all major brands. Screens, batteries, charging ports, and water damage recovery.",
  "Tablet & iPad Repair": "Professional tablet and iPad repair including screens, batteries, and charging ports.",
  "Printer Repair": "Fast and reliable printer repair for all brands. Paper jams, toner issues, and connectivity problems.",
  "Computer Repair": "Desktop computer repair, hardware upgrades, virus removal, and performance optimization.",
  "CCTV Installation": "Professional CCTV camera installation with remote viewing, night vision, and motion detection.",
  "Network Setup": "Complete WiFi installation, router configuration, network troubleshooting, and mesh system setup."
};

const ServiceDetail = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Decode the service name from URL
  const decodedServiceName = decodeURIComponent(serviceName || '');
  
  // Get the category for this service
  const category = serviceToCategory[decodedServiceName] || 'all';
  
  // Get the icon for this service
  const ServiceIcon = serviceIconMap[decodedServiceName] || Wrench;
  
  // Get the description for this service
  const description = serviceDescription[decodedServiceName] || 'Browse our portfolio of completed projects.';

  // Fetch gallery images for this service category
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      console.log(`Fetching images for category: ${category}`);
      const imgs = await getGalleryImages(category);
      console.log(`Found ${imgs.length} images`);
      setImages(imgs);
      setLoading(false);
    };
    
    if (category !== 'all') {
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [category]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mb-8">
            <div className="p-5 bg-primary/10 rounded-2xl w-fit">
              <ServiceIcon className="h-14 w-14 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {decodedServiceName}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">{images.length}</p>
              <p className="text-xs text-muted-foreground">Completed Projects</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">
                {images.reduce((sum, img) => sum + img.views, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">
                {images.reduce((sum, img) => sum + img.likes, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-xs text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-semibold mb-4">
              Our <span className="text-gradient">Portfolio</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real projects we've completed for our clients
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/30">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <ServiceIcon className="h-16 w-16 text-primary/30 mx-auto mb-4 relative" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">No projects in this category yet</p>
              <p className="text-xs text-muted-foreground/70 mb-6">Check back soon for updates</p>
              <Link
                to="/#contact"
                state={{ 
                  service: decodedServiceName,
                  subject: `Quote request for ${decodedServiceName}` 
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Request This Service
              </Link>
            </div>
          ) : (
            <>
              {/* Featured Project */}
              {images.filter(img => img.featured).length > 0 && (
                <div className="mb-16">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    Featured Project
                  </h3>
                  {images.filter(img => img.featured).slice(0, 1).map((featured, index) => (
                    <motion.div
                      key={featured.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 cursor-pointer"
                      onClick={() => openLightbox(featured, images.indexOf(featured))}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={featured.image_url}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                          <h4 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                            {featured.title}
                          </h4>
                          {featured.description && (
                            <p className="text-muted-foreground mb-4">
                              {featured.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(featured.uploaded_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {featured.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {featured.likes} likes
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Project Grid */}
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                All Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 cursor-pointer"
                    onClick={() => openLightbox(image, index)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {image.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-2xs text-white">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {image.title}
                      </h4>
                      {image.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {image.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {image.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {image.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(image.uploaded_at)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section - UPDATED with Link and state */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-semibold mb-4">
            Need a Similar Project?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#contact"
              state={{ 
                service: decodedServiceName,
                subject: `Quote request for ${decodedServiceName}` 
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Mail className="h-5 w-5" />
              Request This Service
            </Link>
            <a
              href={`https://wa.me/254726894129?text=I'm%20interested%20in%20${encodeURIComponent(decodedServiceName)}%20service`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5C] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
            <a
              href="tel:+254743455893"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border text-foreground rounded-lg hover:bg-card transition-colors"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal - UPDATED with Link and state */}
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
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

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

              <div className="lg:w-2/3 bg-black/5 dark:bg-black/20 flex items-center justify-center p-2">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain max-h-[80vh] lg:max-h-[90vh]"
                />
              </div>

              <div className="lg:w-1/3 p-6 overflow-y-auto">
                <div className="space-y-6">
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

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/30">
                    <div className="text-center">
                      <Eye className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-lg font-semibold">{selectedImage.views}</p>
                      <p className="text-3xs text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-lg font-semibold">{selectedImage.likes}</p>
                      <p className="text-3xs text-muted-foreground">Likes</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs font-medium">{formatDate(selectedImage.uploaded_at)}</p>
                      <p className="text-3xs text-muted-foreground">Uploaded</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-xs font-medium mb-2">Interested in this service?</p>
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/#contact"
                        state={{ 
                          service: decodedServiceName,
                          project: selectedImage.title,
                          subject: `Quote request for ${decodedServiceName} - ${selectedImage.title}`
                        }}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Request Similar Project
                      </Link>
                      <a
                        href={`https://wa.me/254726894129?text=I'm%20interested%20in%20${encodeURIComponent(selectedImage.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#25D366] text-white text-xs font-medium rounded-md hover:bg-[#20BA5C] transition-colors"
                      >
                        <MessageCircle className="h-3 w-3" />
                        WhatsApp Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ServiceDetail;