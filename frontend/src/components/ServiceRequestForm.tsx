import { motion } from "framer-motion";
import { 
  Wrench, 
  Smartphone, 
  Laptop, 
  Printer, 
  Camera,
  Wifi,
  Tool,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useState, useRef } from "react";
import api from "../services/api";

const ServiceRequestForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const serviceTypes = [
    { 
      id: "laptop", 
      name: "Laptop Repair", 
      icon: Laptop,
      description: "Screen replacement, battery issues, keyboard, motherboard",
      brands: ["HP", "Dell", "Lenovo", "Apple", "Acer", "Asus", "Toshiba", "Other"]
    },
    { 
      id: "smartphone", 
      name: "Smartphone Repair", 
      icon: Smartphone,
      description: "Screen replacement, battery, charging port, water damage",
      brands: ["Samsung", "iPhone", "Tecno", "Infinix", "Huawei", "Nokia", "Oppo", "Other"]
    },
    { 
      id: "tablet", 
      name: "Tablet/iPad Repair", 
      icon: Smartphone,
      description: "Screen repair, battery service, charging issues",
      brands: ["Apple iPad", "Samsung", "Huawei", "Lenovo", "Amazon Fire", "Other"]
    },
    { 
      id: "printer", 
      name: "Printer Repair", 
      icon: Printer,
      description: "Paper jams, toner issues, connectivity, driver problems",
      brands: ["HP", "Canon", "Epson", "Brother", "Samsung", "Xerox", "Other"]
    },
    { 
      id: "cctv", 
      name: "CCTV Camera", 
      icon: Camera,
      description: "Installation, repair, configuration, remote viewing",
      brands: ["Hikvision", "Dahua", "TP-Link", "EZVIZ", "Swann", "Other"]
    },
    { 
      id: "network", 
      name: "Network Setup", 
      icon: Wifi,
      description: "WiFi installation, router setup, network troubleshooting",
      brands: ["TP-Link", "Netgear", "Ubiquiti", "MikroTik", "Cisco", "Other"]
    },
    { 
      id: "desktop", 
      name: "Desktop Computer", 
      icon: Laptop,
      description: "Hardware upgrades, virus removal, slow performance",
      brands: ["HP", "Dell", "Lenovo", "Apple", "Custom Built", "Other"]
    },
    { 
      id: "other", 
      name: "Other Service", 
      icon: Tool,
      description: "Other repair or service not listed",
      brands: []
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
      service_type: formData.get("service_type"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      issue_description: formData.get("issue_description"),
      preferred_date: formData.get("preferred_date"),
      address: formData.get("address"),
      priority: formData.get("priority") || "normal"
    };

    try {
      // ✅ FIXED: Added trailing slash to prevent 307 redirect
      const response = await api.post("/services/", data);
      if (response.data) {
        setSubmitted(true);
        formRef.current?.reset();
        setSelectedService("");
      }
    } catch (err) {
      console.error("Service request failed:", err);
      setError("Failed to submit service request. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const selectedServiceData = serviceTypes.find(s => s.id === selectedService);

  return (
    <section id="service-request" className="section-padding bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-2">
            <Wrench className="h-3 w-3" />
            Service Request
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Request a <span className="text-gradient">Repair</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light">
            Fill in the form below and we'll get back to you within 1 hour during business hours
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
              Service Request Submitted! 🎉
            </h3>
            <p className="text-green-700 dark:text-green-400 mb-6 max-w-md mx-auto">
              Thank you for choosing Techspark Technologies. We'll diagnose your device and contact you within 1 hour.
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
                Submit Another Request
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
                    Need immediate help? Call us: <a href="tel:+254743455893" className="underline font-medium">0743 455 893</a>
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
                {/* Service Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Select Service Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {serviceTypes.map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedService === service.id;
                      return (
                        <label
                          key={service.id}
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
                            name="service_type"
                            value={service.id}
                            checked={selectedService === service.id}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="sr-only"
                            required
                          />
                          <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-xs font-medium text-center ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {service.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Information */}
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
                      Preferred Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="preferred_date"
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Device Details - Show only if service type selected */}
                {selectedServiceData && selectedServiceData.brands.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium mb-2">
                          Brand <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="brand"
                          required
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                        >
                          <option value="">Select brand</option>
                          {selectedServiceData.brands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2">
                          Model (Optional)
                        </label>
                        <input
                          type="text"
                          name="model"
                          placeholder="e.g., Pavilion x360, iPhone 13"
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Issue Description */}
                <div>
                  <label className="block text-xs font-medium mb-2">
                    Issue Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="issue_description"
                    rows={4}
                    placeholder="Please describe the problem in detail..."
                    required
                    className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                </div>

                {/* Address for pickup/onsite */}
                <div>
                  <label className="block text-xs font-medium mb-2">
                    Pickup/Delivery Address (Optional)
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    placeholder="Your location for pickup or onsite service"
                    className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-medium mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  >
                    <option value="normal">Normal (1-3 days)</option>
                    <option value="high">High (24 hours) - Additional fee applies</option>
                    <option value="urgent">Urgent (Same day) - Additional fee applies</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !selectedService}
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
                        Submit Service Request
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-center text-muted-foreground/70 pt-2">
                  By submitting this form, you agree to our terms of service and privacy policy.
                  We'll contact you within 1 hour during business hours.
                </p>
              </form>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServiceRequestForm;