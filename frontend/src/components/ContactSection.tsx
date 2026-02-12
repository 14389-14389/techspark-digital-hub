import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, MessageCircle, PhoneCall, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅ ADD THIS IMPORT
import emailjs from '@emailjs/browser';
import { submitContact } from "../services/api";

const ContactSection = () => {
  const location = useLocation(); // ✅ ADD THIS
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState(''); // ✅ ADD THIS
  const formRef = useRef<HTMLFormElement>(null);

  // ✅ YOUR EMAILJS CREDENTIALS
  const SERVICE_ID = 'service_nqhj4sp';
  const TEMPLATE_ID = 'template_dbkxcig';
  const PUBLIC_KEY = 'tFEXD5O8VFvJyvYO6';

  // 📞 YOUR CONTACT NUMBERS
  const phoneNumbers = {
    whatsapp: "0726894129",
    call: "0743455893"
  };

  // ✅ PRE-FILL SUBJECT FROM NAVIGATION STATE
  useEffect(() => {
    if (location.state?.subject) {
      setSubject(location.state.subject);
    } else if (location.state?.service) {
      setSubject(`Quote request for ${location.state.service}`);
    }
  }, [location]);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formRef.current) return;

    try {
      // 1️⃣ SEND EMAIL VIA EMAILJS
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );
      
      // 2️⃣ ALSO SAVE TO MONGODB VIA BACKEND
      const formData = {
        name: (formRef.current.elements.namedItem('name') as HTMLInputElement)?.value,
        email: (formRef.current.elements.namedItem('email') as HTMLInputElement)?.value,
        phone: (formRef.current.elements.namedItem('phone') as HTMLInputElement)?.value || '',
        subject: (formRef.current.elements.namedItem('title') as HTMLInputElement)?.value,
        message: (formRef.current.elements.namedItem('message') as HTMLTextAreaElement)?.value,
      };
      
      await submitContact(formData);
      console.log('✅ Saved to MongoDB');
      
      setSubmitted(true);
      formRef.current.reset();
      setSubject(''); // ✅ Clear subject after submission
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to send message. Please try again or contact us directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Button Component
  const WhatsAppButton = ({ number, label }: { number: string; label?: string }) => (
    <a
      href={`https://wa.me/${number}?text=Hello%20Techspark%20Technologies!%20I'd%20like%20to%20inquire%20about%20your%20services.`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#25D366] text-white text-xs font-medium tracking-wide uppercase hover:bg-[#20BA5C] transition-all duration-300 w-full sm:w-auto"
    >
      <MessageCircle className="h-4 w-4" />
      {label || `WhatsApp ${number}`}
    </a>
  );

  // Call Button Component
  const CallButton = ({ number, label }: { number: string; label?: string }) => (
    <a
      href={`tel:+254${number.slice(1)}`}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#0A66C2] text-white text-xs font-medium tracking-wide uppercase hover:bg-[#004182] transition-all duration-300 w-full sm:w-auto"
    >
      <PhoneCall className="h-4 w-4" />
      {label || `Call ${number}`}
    </a>
  );

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
            contact us
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
            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="h-4 w-4 text-primary/50 mt-0.5" />
              <div>
                <p className="text-2xs text-muted-foreground tracking-wide uppercase">Email</p>
                <p className="text-sm font-medium mt-0.5">kevinkisaa001@gmail.com</p>
                <p className="text-xs text-muted-foreground mt-1">✓ Replies within 24 hours</p>
              </div>
            </div>

            {/* WhatsApp - Primary */}
            <div className="flex items-start gap-4">
              <MessageCircle className="h-4 w-4 text-[#25D366] mt-0.5" />
              <div className="flex-1">
                <p className="text-2xs text-muted-foreground tracking-wide uppercase">WhatsApp (Fastest)</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm font-medium">{phoneNumbers.whatsapp}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                    Primary
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">✓ Response in under 5 minutes</p>
                <div className="mt-2">
                  <WhatsAppButton number={phoneNumbers.whatsapp} label="Message on WhatsApp" />
                </div>
              </div>
            </div>

            {/* Call - Secondary */}
            <div className="flex items-start gap-4">
              <Phone className="h-4 w-4 text-[#0A66C2] mt-0.5" />
              <div className="flex-1">
                <p className="text-2xs text-muted-foreground tracking-wide uppercase">Call Us</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm font-medium">{phoneNumbers.call}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    Call
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">✓ Monday - Friday, 8am - 6pm</p>
                <div className="mt-2">
                  <CallButton number={phoneNumbers.call} label="Call Now" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <MapPin className="h-4 w-4 text-primary/50 mt-0.5" />
              <div>
                <p className="text-2xs text-muted-foreground tracking-wide uppercase">Location</p>
                <p className="text-sm font-medium mt-0.5">Nairobi, Kenya</p>
                <p className="text-xs text-muted-foreground mt-1">Available for on site visits</p>
              </div>
            </div>

            {/* Quick Actions - Mobile Friendly */}
            <div className="pt-6 border-t border-border/20">
              <p className="text-2xs text-muted-foreground tracking-wide uppercase mb-4">
                Contact Options
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <WhatsAppButton number={phoneNumbers.whatsapp} label="WhatsApp" />
                  <CallButton number={phoneNumbers.call} label="Call" />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  <span className="font-medium text-foreground">{phoneNumbers.whatsapp}</span> (WhatsApp) • <span className="font-medium text-foreground">{phoneNumbers.call}</span> (Call)
                </p>
              </div>
            </div>
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
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-lg border border-green-200 bg-green-50 p-8 md:p-12 text-center dark:bg-green-950/20 dark:border-green-900"
              >
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4 dark:text-green-400" />
                <h3 className="font-display text-xl font-medium mb-2 text-green-800 dark:text-green-300">
                  Message Sent Successfully! 🎉
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mb-6">
                  Thank you for contacting Techspark. We'll get back to you within 24 hours.
                </p>
                
                <div className="border-t border-green-200 pt-6 dark:border-green-900">
                  <p className="text-xs text-green-600 mb-4 dark:text-green-400 font-medium">
                    Need an immediate response?
                  </p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      <a
                        href={`https://wa.me/${phoneNumbers.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-[#25D366] text-white text-xs font-medium hover:bg-[#20BA5C] transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Now
                      </a>
                      <a
                        href={`tel:+254${phoneNumbers.call.slice(1)}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-[#0A66C2] text-white text-xs font-medium hover:bg-[#004182] transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      WhatsApp: {phoneNumbers.whatsapp} | Call: {phoneNumbers.call}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs text-green-600 hover:text-green-800 underline dark:text-green-400"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 dark:bg-red-950/20 dark:border-red-900">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5 dark:text-red-400" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                      <p className="text-xs text-red-600 mt-1 dark:text-red-400">
                        Try WhatsApp instead: <a href={`https://wa.me/${phoneNumbers.whatsapp}`} className="underline font-medium">{phoneNumbers.whatsapp}</a>
                      </p>
                    </div>
                  </div>
                )}

                <form 
                  ref={formRef} 
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-2xs text-muted-foreground tracking-wide uppercase mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full names"
                        required
                        className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs text-muted-foreground tracking-wide uppercase mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="client@example.com"
                        required
                        className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs text-muted-foreground tracking-wide uppercase mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0726 894 129"
                      className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-muted-foreground tracking-wide uppercase mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={subject} // ✅ BIND TO STATE
                      onChange={(e) => setSubject(e.target.value)} // ✅ ALLOW EDITING
                      placeholder="Website Development / CCTV Installation / Repair Service"
                      required
                      className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-muted-foreground tracking-wide uppercase mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Tell us about your project, requirements, or how we can help..."
                      required
                      className="w-full px-4 py-3 rounded-md bg-card/30 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 transition-colors duration-300 resize-none"
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    {/* Main submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/30"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-muted-foreground">or contact directly</span>
                      </div>
                    </div>

                    {/* WhatsApp & Call buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <a
                        href={`https://wa.me/${phoneNumbers.whatsapp}?text=Hello%20Techspark%20Technologies!%20I'd%20like%20to%20inquire%20about%20your%20services.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-md bg-[#25D366] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#20BA5C] transition-all duration-300"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                        <span className="sm:hidden">WA</span>
                      </a>
                      <a
                        href={`tel:+254${phoneNumbers.call.slice(1)}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-md bg-[#0A66C2] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#004182] transition-all duration-300"
                      >
                        <PhoneCall className="h-5 w-5" />
                        <span className="hidden sm:inline">Call Now</span>
                        <span className="sm:hidden">Call</span>
                      </a>
                    </div>

                    {/* Phone numbers display */}
                    <div className="text-center text-xs text-muted-foreground bg-card/20 p-3 rounded-md">
                      <span className="font-medium text-foreground">WhatsApp:</span> {phoneNumbers.whatsapp} 
                      <span className="mx-2">•</span>
                      <span className="font-medium text-foreground">Call:</span> {phoneNumbers.call}
                    </div>
                  </div>

                  <p className="text-3xs text-muted-foreground/70 text-center pt-2">
                    ✓ Your information will be sent to <strong>kevinkisaa001@gmail.com</strong> and saved in our database
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;