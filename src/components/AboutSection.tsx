import { motion } from "framer-motion";
import { Award, Users, Clock, Zap } from "lucide-react";

const stats = [
  { icon: Award, value: "10+", label: "Years Experience" },
  { icon: Users, value: "50+", label: "Clients Served" },
  { icon: Clock, value: "24/7", label: "Support" },
  { icon: Zap, value: "99.9%", label: "Uptime SLA" },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              About Us
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Built by Engineers,
              <br />
              <span className="text-gradient">Driven by Results</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              TechSpark Technologies was founded by <strong className="text-foreground">Engineer Kevin Muli</strong> with
              a clear mission: to provide businesses with secure, scalable, and resilient technology solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We partner with organizations of all sizes to build custom digital products, manage IT infrastructure,
              and safeguard operations against evolving cyber threats. Your growth is our spark.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-display font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl glass glow-border flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <Zap className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse-glow" />
                <p className="font-display text-3xl font-bold">
                  TECH<span className="text-gradient">SPARK</span>
                </p>
                <p className="text-muted-foreground text-sm mt-2">Technologies</p>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
