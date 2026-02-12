import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-8"
          >
            Catalyst for Your Digital Future
          </motion.p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold leading-tight mb-6">
            Technology that
            <br />
            <span className="text-gradient">Powers Growth</span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed font-light">
            We provide complete digital solutions — from custom applications
            to cybersecurity — built to protect and scale your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#contact"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-md bg-primary text-primary-foreground text-xs font-medium tracking-wide uppercase transition-all duration-300"
            >
              Start a Project
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.a>
            <motion.a
              href="#services"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-md border border-border/50 text-foreground/70 text-xs font-medium tracking-wide uppercase hover:border-primary/30 hover:text-foreground transition-all duration-300"
            >
              Explore Services
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
