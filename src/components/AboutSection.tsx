import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const stats = [
  { value: "10+", label: "Years" },
  { value: "50+", label: "Clients" },
  { value: "24/7", label: "Support" },
  { value: "99.9%", label: "Uptime" },
];

const AboutSection = () => {
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
            <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4">
              About Us
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6">
              Built by Engineers,{" "}
              <span className="text-gradient">Driven by Results</span>
            </h2>
            <div className="space-y-4 mb-10">
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Founded by <span className="text-foreground font-medium">Engineer Kevin Muli</span>, TechSpark
                Technologies partners with organizations to build custom digital products, manage IT infrastructure,
                and safeguard operations against evolving cyber threats.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                We believe in secure, scalable, and resilient technology — solutions that don't just
                work today, but grow with you tomorrow.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-display font-semibold text-foreground">{stat.value}</p>
                  <p className="text-2xs text-muted-foreground tracking-wide uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="w-full aspect-square rounded-2xl border border-border/30 bg-card/20 flex items-center justify-center relative overflow-hidden">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(199 89% 48%) 39px, hsl(199 89% 48%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(199 89% 48%) 39px, hsl(199 89% 48%) 40px)`
              }} />

              <div className="text-center relative z-10">
                <Zap className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <p className="font-display text-xl font-semibold tracking-wide">
                  TECH<span className="text-gradient">SPARK</span>
                </p>
                <p className="text-2xs text-muted-foreground tracking-[0.2em] uppercase mt-1">Technologies</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
