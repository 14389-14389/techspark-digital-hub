import { motion } from "framer-motion";
import { 
  Code2, 
  Server, 
  ShieldCheck, 
  Headset,
  Wrench,
  Smartphone,
  Camera,
  Printer,
  Laptop,
  Wifi,
  Tablet,
  Cpu
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  // Development & IT
  {
    icon: Code2,
    title: "Web & Mobile Apps",
    description: "Custom applications built with modern architectures, tailored to your business workflows.",
    category: "development"
  },
  {
    icon: Server,
    title: "IT & Network Management",
    description: "Proactive monitoring and optimization ensuring your infrastructure runs at peak performance.",
    category: "network"
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Comprehensive security assessments and penetration testing to protect your digital assets.",
    category: "consultancy"
  },
  {
    icon: Headset,
    title: "Support & Consultancy",
    description: "Dedicated technical guidance to navigate your digital transformation with confidence.",
    category: "consultancy"
  },
  
  // Repair Services
  {
    icon: Laptop,
    title: "Laptop Repair",
    description: "Screen replacement, battery issues, motherboard repair, virus removal, and performance upgrades.",
    category: "repairs"
  },
  {
    icon: Smartphone,
    title: "Smartphone Repair",
    description: "Screen repair, battery replacement, charging port fixes, water damage recovery.",
    category: "repairs"
  },
  {
    icon: Tablet,
    title: "Tablet & iPad Repair",
    description: "Professional tablet repair including screens, batteries, and charging ports.",
    category: "repairs"
  },
  {
    icon: Printer,
    title: "Printer Repair",
    description: "Paper jam fixes, toner replacement, connectivity issues, and maintenance.",
    category: "repairs"
  },
  
  // CCTV & Security
  {
    icon: Camera,
    title: "CCTV Installation",
    description: "Professional CCTV camera installation, configuration, remote viewing setup, and maintenance.",
    category: "cctv"
  },
  {
    icon: Wifi,
    title: "Network Setup",
    description: "WiFi installation, router configuration, network troubleshooting, and mesh system setup.",
    category: "network"
  },
  {
    icon: Cpu,
    title: "Computer Repair",
    description: "Desktop computer repair, hardware upgrades, virus removal, and optimization.",
    category: "repairs"
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Our Services
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light">
            Complete technology solutions  from repairs to development. Click any service to see our portfolio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group h-full"
              >
                <Link
                  to={`/service/${encodeURIComponent(service.title)}`}
                  className="block h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>View Projects</span>
                    <span className="text-lg">→</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Category Legend */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="text-xs text-center text-muted-foreground">
            <span className="inline-flex items-center gap-1 mx-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Development
            </span>
            <span className="inline-flex items-center gap-1 mx-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Repairs
            </span>
            <span className="inline-flex items-center gap-1 mx-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span> CCTV & Security
            </span>
            <span className="inline-flex items-center gap-1 mx-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Network
            </span>
            <span className="inline-flex items-center gap-1 mx-3">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Consultancy
            </span>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Need a custom solution? Contact us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;