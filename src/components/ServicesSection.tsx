import { motion } from "framer-motion";
import { Code2, Server, ShieldCheck, Headset } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Custom Web & Mobile Apps",
    description:
      "Tailored applications built with cutting-edge tech stacks to meet your unique business requirements.",
  },
  {
    icon: Server,
    title: "IT & Network Management",
    description:
      "Proactive monitoring, maintenance, and optimization of your entire IT infrastructure for zero-downtime operations.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity & Pen Testing",
    description:
      "Comprehensive security assessments and penetration testing to identify vulnerabilities before attackers do.",
  },
  {
    icon: Headset,
    title: "Support & Consultancy",
    description:
      "Dedicated technical support and expert consultancy to guide your digital transformation journey.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            What We Do
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            End-to-end IT solutions designed to accelerate your business and fortify your defenses.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="group glass rounded-xl p-6 hover:border-primary/40 transition-all hover:shadow-[var(--shadow-glow-sm)]"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
