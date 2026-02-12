import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Camera, 
  Code2, 
  Wrench, 
  Wifi, 
  Headset,
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  DollarSign
} from "lucide-react";
import { useState, useRef } from "react";
import api from "../services/api";

const QuoteRequestForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const serviceCategories = [
    { 
      id: "cctv", 
      name: "CCTV & Security", 
      icon: Camera,
      description: "Camera installation, access control, alarm systems",
      examples: ["Home security", "Office surveillance", "Remote monitoring"]
    },
    { 
      id: "development", 
      name: "Web & Mobile Development", 
      icon: Code2,
      description: "Custom websites, mobile apps, e-commerce",
      examples: ["Company website", "Mobile app", "Online store"]
    },
    { 
      id: "repairs", 
      name: "Repairs & Maintenance", 
      icon: Wrench,
      description: "Device repair, maintenance contracts",
      examples: ["Bulk device repair", "Maintenance contract", "School/devices"]
    },
    { 
      id: "network", 
      name: "IT & Network", 
      icon: Wifi,
      description: "Network setup, infrastructure, cloud services",
      examples: ["Office network", "Server setup", "Cloud migration"]
    },
    { 
      id: "consultancy", 
      name: "Consultancy", 
      icon: Headset,
      description: "IT consulting, digital transformation",
      examples: ["Tech strategy", "Security audit", "Process automation"]
    },
    { 
      id: "other", 
      name: "Other Services", 
      icon: TrendingUp,
      description: "Other technology services",
      examples: ["Custom solution", "Bulk order", "Partnership"]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service_category: formData.get("service_category"),
      project_description: formData.get("project_description"),
      budget_range: formData.get("budget_range"),
      timeline: formData.get("timeline"),
      site_address: formData.get("site_address")
    };

    try {
      const response = await api.post("/quotes", data);
      if (response.data) {
        setSubmitted(true);
        formRef.current?.reset();
        setSelectedCategory("");
      }
    } catch (err) {
      console.error("Quote request failed:", err);
      setError("Failed to submit quote request. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryData = serviceCategories.find(c => c.id === selectedCategory);

  return (
    <section id="quote-request" className="section-padding border-t border-border/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Request Quote
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Get a Free <span className="text-gradient">Quote</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light">
            Tell us about your project and we'll provide you with a detailed quote within 24 hours
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-2xl p-12 text-center"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl" />
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 relative" />
            </div>
            <h3 className="text-2xl font-display font-semibold mb-3 text-green-800 dark:text-green-300">
              Quote Request Received! 🎉
            </h3>
            <p className="text-green-700 dark:text-green-400 mb-6 max-w-md mx-auto">
              Thank you for your interest in Techspark Technologies. We'll prepare your quote and contact you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/254726894129"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5C] transition-colors"
              >
                <Phone className="h-4 w-4" />
                WhatsApp Us
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Request Another Quote
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Need immediate assistance? Call us: <a href="tel:+254743455893" className="underline font-medium">0743 455 893</a>
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
            >
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Service Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Select Service Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {serviceCategories.map((category) => {
                      const Icon = category.icon;
                      const isSelected = selectedCategory === category.id;
                      return (
                        <label
                          key={category.id}
                          className={`
                            relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer
                            transition-all duration-300 hover:scale-105
                            ${isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border/50 bg-background/50 hover:border-primary/30'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="service_category"
                            value={category.id}
                            checked={selectedCategory === category.id}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="sr-only"
                            required
                          />
                          <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-xs font-medium text-center ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {category.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Category Description - Show if selected */}
                {selectedCategoryData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-primary/5 rounded-lg"
                  >
                    <p className="text-sm text-primary mb-2">{selectedCategoryData.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategoryData.examples.map((example, index) => (
                        <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {example}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0726 894 129"
                      required
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2">
                      Budget Range (KES)
                    </label>
                    <select
                      name="budget_range"
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    >
                      <option value="">Select budget range</option>
                      <option value="0-50000">0 - 50,000 KES</option>
                      <option value="50000-100000">50,000 - 100,000 KES</option>
                      <option value="100000-250000">100,000 - 250,000 KES</option>
                      <option value="250000-500000">250,000 - 500,000 KES</option>
                      <option value="500000+">500,000+ KES</option>
                    </select>
                  </div>
                </div>

                {/* Project Timeline */}
                <div>
                  <label className="block text-xs font-medium mb-2">
                    Preferred Timeline
                  </label>
                  <select
                    name="timeline"
                    className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  >
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (Within 1 week)</option>
                    <option value="normal">Normal (1-2 weeks)</option>
                    <option value="relaxed">Relaxed (2-4 weeks)</option>
                    <option value="planning">Just planning (1-3 months)</option>
                  </select>
                </div>

                {/* Site Address - For CCTV/Onsite services */}
                {selectedCategory === "cctv" && (
                  <div>
                    <label className="block text-xs font-medium mb-2">
                      Site Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="site_address"
                      rows={2}
                      placeholder="Full address for CCTV installation or onsite service"
                      required
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                    />
                  </div>
                )}

                {/* Project Description */}
                <div>
                  <label className="block text-xs font-medium mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="project_description"
                    rows={5}
                    placeholder="Please describe your project in detail. Include specific requirements, number of cameras, features needed, etc."
                    required
                    className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !selectedCategory}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Request Free Quote
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-center text-muted-foreground/70 pt-2">
                  ✓ Free, no-obligation quote • Response within 24 hours • Detailed project analysis
                </p>
              </form>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default QuoteRequestForm;