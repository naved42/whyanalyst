import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';

interface ContactPageProps {
  onAuth: () => void;
  onNavigate?: (page: string) => void;
}

export const ContactPage = ({ onAuth, onNavigate = () => {} }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Route submissions through the user's email client until a backend contact endpoint is added.
      const emailSubject = encodeURIComponent(`[WhyAnalyst] ${formData.subject.trim()}`);
      const emailBody = encodeURIComponent(
        `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\n${formData.message.trim()}`
      );
      window.location.href = `mailto:support@whyanalyst.com?subject=${emailSubject}&body=${emailBody}`;

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setSubmitError('Unable to open your email client. Please email support@whyanalyst.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-brand-background pt-16 sm:pt-20">
      <Navbar currentPage="contact" onNavigate={onNavigate} onAuth={onAuth} />
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-on-surface"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-brand-surface-variant max-w-2xl mx-auto"
          >
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </header>

      {/* Contact Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-brand-on-surface">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-on-surface mb-1">Email</h3>
                  <a href="mailto:support@whyanalyst.com" className="text-brand-primary hover:underline">
                    support@whyanalyst.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-on-surface mb-1">Phone</h3>
                  <a href="tel:+1234567890" className="text-brand-primary hover:underline">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-on-surface mb-1">Address</h3>
                  <p className="text-brand-surface-variant">
                    123 Data Street<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="font-bold text-lg text-brand-on-surface mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/about" className="text-brand-primary hover:underline block">→ About Us</a>
                <a href="/features" className="text-brand-primary hover:underline block">→ Features</a>
                <a href="/pricing" className="text-brand-primary hover:underline block">→ Pricing</a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-100 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-brand-on-surface mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-brand-on-surface mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-brand-on-surface mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-brand-on-surface mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Opening Email Client...' : 'Send Message'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-50 text-green-800 rounded-lg text-center"
                >
                  Message sent! We'll get back to you soon.
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 text-red-800 rounded-lg text-center"
                >
                  {submitError}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
