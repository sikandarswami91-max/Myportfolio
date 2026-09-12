import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Github, Linkedin, Send, Check, Copy, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { PERSONAL_INFO, WHATSAPP_URL } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ContactProps {
  theme: ThemeMode;
}

export const Contact: React.FC<ContactProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  // Keep horizontal slide-ins on large screens only; below `lg` the columns
  // span the full viewport and a horizontal offset would overflow it.
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const validate = () => {
    const errs: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) {
      errs.name = 'Please enter your name';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    }, 1000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-heading tracking-tight ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Let's Work Together
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
          }`}>
            Have a project or opportunity? Feel free to get in touch.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: isDesktop ? -30 : 0, y: isDesktop ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="mb-6">
              <h3 className={`text-xl font-bold font-heading mb-2 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                Connect Directly
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
              }`}>
                Whether you're looking for a dedicated full-time MERN Stack developer, an ambitious intern, or an agile freelancer, I am ready to contribute.
              </p>
            </div>

            {/* Email Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                isDark
                  ? 'bg-neutral-900/80 border-neutral-800/90'
                  : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-medium ${
                    isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                  }`}>
                    Email Address
                  </div>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className={`text-sm font-semibold break-all transition-colors ${
                      isDark ? 'text-white hover:text-cyan-400' : 'text-neutral-900 hover:text-cyan-500'
                    }`}
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>

              <button
                onClick={copyEmail}
                className={`p-2 rounded-lg border transition-colors ${
                  copiedEmail
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                    : isDark
                    ? 'border-neutral-700 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
                    : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
                }`}
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                isDark
                  ? 'bg-neutral-900/80 border-neutral-800/90'
                  : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-medium ${
                    isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                  }`}>
                    Phone / WhatsApp
                  </div>
                  <a
                    href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`}
                    className={`text-sm font-semibold transition-colors ${
                      isDark ? 'text-white hover:text-emerald-400' : 'text-neutral-900 hover:text-emerald-500'
                    }`}
                  >
                    {PERSONAL_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* WhatsApp click-to-chat anchor (opens WhatsApp app on mobile,
                    WhatsApp Web / wa.me page on desktop) */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-neutral-700 hover:bg-neutral-800 text-[#25D366]'
                      : 'border-neutral-200 hover:bg-neutral-100 text-[#25D366]'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`}
                  title="Chat with me on WhatsApp"
                  aria-label="Chat with me on WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>

                <button
                  onClick={copyPhone}
                  className={`p-2 rounded-lg border transition-colors ${
                    copiedPhone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : isDark
                      ? 'border-neutral-700 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
                      : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
                  }`}
                  title="Copy Phone Number"
                >
                  {copiedPhone ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* GitHub & LinkedIn Social Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all hover:-translate-y-1 ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800/90 hover:border-neutral-700'
                    : 'bg-white border-neutral-200 shadow-sm hover:border-neutral-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-800/20 text-neutral-900'
                }`}>
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-medium ${
                    isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                  }`}>Profile</div>
                  <div className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}>GitHub</div>
                </div>
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all hover:-translate-y-1 ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800/90 hover:border-neutral-700'
                    : 'bg-white border-neutral-200 shadow-sm hover:border-neutral-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-medium ${
                    isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                  }`}>Network</div>
                  <div className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}>LinkedIn</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isDesktop ? 30 : 0, y: isDesktop ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border ${
              isDark
                ? 'bg-neutral-900/80 border-neutral-800/90 shadow-xl'
                : 'bg-white border-neutral-200 shadow-lg shadow-neutral-200/50'
            }`}
          >
            <h3 className={`text-xl sm:text-2xl font-bold font-heading mb-2 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Send a Message
            </h3>
            <p className={`text-sm mb-6 ${
              isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
            }`}>
              Fill out the form below, and I will get back to you promptly.
            </p>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                  <span>Thank you! Your message has been sent successfully. I will get back to you soon.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                      isDark ? 'text-white' : 'text-neutral-700'
                    }`}
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Enter name"
                    className={`w-full px-4 py-3 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500/30'
                        : isDark
                        ? 'bg-neutral-900/90 border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:ring-cyan-500/50 focus:border-cyan-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                      isDark ? 'text-white' : 'text-neutral-700'
                    }`}
                  >
                    Your Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Enter email"
                    className={`w-full px-4 py-3 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500/30'
                        : isDark
                        ? 'bg-neutral-900/90 border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:ring-cyan-500/50 focus:border-cyan-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-white' : 'text-neutral-700'
                  }`}
                >
                  Message / Project Details *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder="Tell me about your project, timeline, or developer opportunity..."
                  className={`w-full px-4 py-3 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-500/30'
                      : isDark
                      ? 'bg-neutral-900/90 border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:ring-cyan-500/50 focus:border-cyan-500'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-cyan-500/30 disabled:opacity-70 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
