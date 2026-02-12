import { motion } from "framer-motion";
import { Zap, Award, Users, Clock, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { getCompanyInfo } from "../services/api";

const AboutSection = () => {
  const [companyInfo, setCompanyInfo] = useState({
    founded: "2025",
    clients: "50+",
    support: "24/7",
    uptime: "99.9%",
    founder: "Engineer Kevin Muli",
    description: "TechSpark Technologies partners with organizations to build custom digital products, manage IT infrastructure, and safeguard operations against evolving cyber threats.",
    mission: "We believe in secure, scalable, and resilient technology solutions that don't just work today, but grow with you tomorrow."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        // Fetch real data from your backend
        const response = await fetch('http://localhost:8000/');
        const data = await response.json();
        
        if (data) {
          setCompanyInfo({
            founded: "2025",
            clients: "50+", 
            support: "24/7",
            uptime: "99.9%",
            founder: "Engineer Kevin Muli",
            description: data.tagline || companyInfo.description,
            mission: data.mission || companyInfo.mission
          });
        }
      } catch (error) {
        console.log('Using default company info');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const stats = [
    { value: "2025", label: "Founded", icon: Award },
    { value: companyInfo.clients, label: "Clients", icon: Users },
    { value: companyInfo.support, label: "Support", icon: Clock },
    { value: companyInfo.uptime, label: "Uptime", icon: Shield },
  ];

  return (
    <section id="about" className="section-padding border-t border-border/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
              <Zap className="h-3 w-3" />
              About Us
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6">
              Built by Engineers,{" "}
              <span className="text-gradient">Driven by Results</span>
            </h2>
            <div className="space-y-4 mb-10">
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Founded by <span className="text-foreground font-medium">{companyInfo.founder}</span>, TechSpark
                Technologies partners with organizations to build custom digital products, manage IT infrastructure,
                and safeguard operations against evolving cyber threats.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {companyInfo.mission}
              </p>
            </div>

            {/* Stats - Enhanced */}
            <div className="grid grid-cols-4 gap-6">
              {stats.map((stat) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-primary/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <div className="relative p-3">
                    <stat.icon className="h-4 w-4 text-primary/60 mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-2xl font-display font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-2xs text-muted-foreground tracking-wide uppercase mt-1">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Company Values */}
            <div className="mt-10 pt-8 border-t border-border/20">
              <div className="flex flex-wrap gap-4">
                <span className="text-xs bg-primary/5 text-primary px-4 py-2 rounded-full">
                  ✓ ISO 27001 Certified
                </span>
                <span className="text-xs bg-primary/5 text-primary px-4 py-2 rounded-full">
                  ✓ 24/7 Emergency Support
                </span>
                <span className="text-xs bg-primary/5 text-primary px-4 py-2 rounded-full">
                  ✓ Free Consultation
                </span>
              </div>
            </div>
          </motion.div>

          {/* Visual - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="w-full aspect-square rounded-2xl border border-border/30 bg-gradient-to-br from-card/40 to-card/20 flex items-center justify-center relative overflow-hidden group">
              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(142 76% 36%) 39px, hsl(142 76% 36%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(142 76% 36%) 39px, hsl(142 76% 36%) 40px)`
              }} />

              {/* Glowing orb effect */}
              <div className="absolute w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
              
              {/* Main content */}
              <div className="text-center relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-ping opacity-20" />
                  <Zap className="h-16 w-16 text-primary mx-auto mb-4 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <p className="font-display text-2xl font-semibold tracking-wide mb-2">
                  TECH<span className="text-gradient">SPARK</span>
                </p>
                <p className="text-xs text-muted-foreground tracking-[0.25em] uppercase">
                  Technologies
                </p>
                
                {/* Established year */}
                <div className="mt-6 pt-6 border-t border-border/20">
                  <p className="text-3xs text-muted-foreground uppercase tracking-wider">
                    Established {companyInfo.founded}
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-primary/30 rounded-full" />
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary/20 rounded-full" />
              <div className="absolute top-1/2 left-6 w-1 h-1 bg-primary/40 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;