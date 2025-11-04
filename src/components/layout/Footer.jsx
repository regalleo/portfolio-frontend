import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCopy, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useTheme();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/regalleo', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/raj-shekhar-singh-aa16ab245/', label: 'LinkedIn' },
  ];

  const copyToClipboard = async (text) => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        if (!successful) {
          throw new Error('Fallback copy method failed');
        }

        document.body.removeChild(textArea);
      }

      setCopiedEmail(true);
      
      // FIXED: Better toast styling without multiline
      toast.success('Email copied to clipboard!', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: isDarkMode ? '#10b981' : '#059669',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        icon: '✓',
      });

      setTimeout(() => setCopiedEmail(false), 3000);
    } catch (err) {
      console.error('Failed to copy email:', err);
      toast.error('Failed to copy. Try again!', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: isDarkMode ? '#ef4444' : '#dc2626',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        icon: '✕',
      });
    }
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      className={`relative overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white'
          : 'bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900'
      }`}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background Elements - OPTIMIZED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode ? 'bg-cyan-500/5' : 'bg-blue-500/5'
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ willChange: 'transform, opacity' }}
        />
        <motion.div
          className={`absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl ${
            isDarkMode ? 'bg-purple-500/5' : 'bg-purple-500/5'
          }`}
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{ duration: 30, repeat: Infinity, delay: 8 }}
          style={{ willChange: 'transform, opacity' }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <div>
            <h3 className={`text-2xl font-bold mb-4 bg-clip-text text-transparent ${
              isDarkMode
                ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
            }`}>
              Raj Shekhar Singh
            </h3>
            <p className={`mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Full-Stack Developer & Data Engineer passionate about building scalable applications and solving complex problems.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={`footer-social-${social.label}-${idx}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-cyan-500 focus:ring-offset-black'
                      : 'bg-gray-200 hover:bg-blue-500 focus:ring-offset-white'
                  }`}
                  tabIndex={0}
                  aria-label={`Visit ${social.label} profile`}
                >
                  <social.icon className={`w-5 h-5 ${
                    isDarkMode ? 'text-white' : 'text-gray-700'
                  }`} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Links
            </h3>
            <nav aria-label="Footer quick links">
              <ul className="space-y-2">
                {quickLinks.map((link, idx) => (
                  <li key={`footer-quick-link-${link.name}-${idx}`}>
                    <a
                      href={link.href}
                      className={`inline-block transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-2 py-1 ${
                        isDarkMode
                          ? 'text-gray-400 hover:text-cyan-400'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                      tabIndex={0}
                      aria-label={`Navigate to ${link.name} section`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Section - FIXED */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Contact
            </h3>
            
            <div className={`space-y-3 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {/* Email */}
              <div className="flex items-center space-x-3">
                <FaEnvelope className={`w-5 h-5 flex-shrink-0 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-500'
                }`} aria-hidden="true" />
                <motion.button
                  onClick={() => copyToClipboard('rajsingh170901@gmail.com')}
                  className={`flex items-center space-x-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-2 py-1 text-left ${
                    isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  tabIndex={0}
                  aria-label="Copy email address to clipboard"
                  type="button"
                >
                  <span>rajsingh170901@gmail.com</span>
                  <motion.div
                    animate={copiedEmail ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    {copiedEmail ? (
                      <FaCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <FaCopy className="w-4 h-4 opacity-50 hover:opacity-100" />
                    )}
                  </motion.div>
                </motion.button>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <FaPhone className={`w-5 h-5 flex-shrink-0 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-500'
                }`} aria-hidden="true" />
                <a
                  href="tel:+918840082361"
                  className={`transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-2 py-1 ${
                    isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-600'
                  }`}
                  tabIndex={0}
                  aria-label="Call phone number +91-8840082361"
                >
                  +91-8840082361
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className={`w-5 h-5 flex-shrink-0 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-500'
                }`} aria-hidden="true" />
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className={`border-t pt-8 text-center ${
            isDarkMode ? 'border-gray-800' : 'border-gray-300'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © {currentYear} Raj Shekhar Singh. All rights reserved. Built with ❤️
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
