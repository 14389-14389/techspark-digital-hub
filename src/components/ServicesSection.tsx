import { motion } from "framer-motion";
import { Code2, Server, ShieldCheck, Headset } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web & Mobile Apps",
    description: "Custom applications built with modern architectures, tailored to your business workflows.",
  },
  {
    icon: Server,
    title: "IT & Network Management",
    description: "Proactive monitoring and optimization ensuring your infrastructure runs at peak performance.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Comprehensive security assessments and penetration testing to protect your digital assets.",
  },
  {
    icon: Headset,
    title: "Support & Consultancy",
    description: "Dedicated technical guidance to navigate your digital transformation with confidence.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Our Services
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-light">
            End-to-end solutions designed to accelerate business and fortify defenses.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30 rounded-lg overflow-hidden">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
              className="bg-background p-8 group hover:bg-card/50 transition-all duration-500"
            >
              <service.icon className="h-5 w-5 text-primary/60 mb-6 group-hover:text-primary transition-colors duration-500" />
              <h3 className="font-display text-sm font-medium mb-3">{service.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
