import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure. Scalable. Resilient.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
            Powering Your
            <br />
            <span className="text-gradient">Digital Future</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            TechSpark Technologies delivers complete digital solutions — from custom applications
            to cybersecurity — to power and protect your growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:shadow-[var(--shadow-glow)]"
            >
              Start a Project
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-semibold text-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              Our Services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
