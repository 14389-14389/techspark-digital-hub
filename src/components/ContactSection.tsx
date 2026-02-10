import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-padding border-t border-border/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-2xs font-medium text-primary tracking-[0.25em] uppercase mb-4">
            Get In Touch
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Let's Work Together
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-light">
            Ready to spark your digital transformation? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-8"
          >
            {[
              { icon: Mail, label: "Email", value: "info@techspark.co.ke" },
              { icon: Phone, label: "Phone", value: "+254 700 000 000" },
              { icon: MapPin, label: "Location", value: "Nairobi, Kenya" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <item.icon className="h-4 w-4 text-primary/50 mt-0.5" />
                <div>
                  <p className="text-2xs text-muted-foreground tracking-wide uppercase">{item.label}</p>
                  <p className="text-sm font-medium mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="rounded-lg border border-border/30 p-12 text-center">
                <Send className="h-5 w-5 text-primary mx-auto mb-4" />
                <h3 className="font-display text-sm font-medium mb-2">Message Sent</h3>
                <p className="text-xs text-muted-foreground">We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300"
                />
                <textarea
                  rows={5}
                  placeholder="Tell us about your project..."
                  required
                  className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300 resize-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-md bg-primary text-primary-foreground text-xs font-medium tracking-wide uppercase hover:bg-primary/90 transition-all duration-300"
                >
                  Send Message
                  <Send className="h-3 w-3" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
