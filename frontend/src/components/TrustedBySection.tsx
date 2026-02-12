import { motion } from "framer-motion";

const logos = [
  "Enterprise Co", "DataFlow", "SecureNet", "CloudBase", "NexGen",
  "DigitalEdge", "TrustTech", "InnoLabs", "CyberGuard", "NetPrime",
];

const TrustedBySection = () => {
  return (
    <section className="py-16 border-t border-b border-border/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xs font-medium text-muted-foreground tracking-[0.25em] uppercase text-center"
        >
          Trusted by Leading Organizations
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...logos, ...logos].map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-10 flex items-center justify-center"
            >
              <span className="text-xs font-display font-medium text-muted-foreground/40 tracking-widest uppercase whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
