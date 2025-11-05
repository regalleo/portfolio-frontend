import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import { contactAPI } from '../../services/api';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaArrowLeft, FaArrowRight, FaCheck, FaCopy, FaUpload, FaTimes, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

// Validation schema
const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  subject: yup
    .string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const meshRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const watchedFields = watch();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('File type not supported. Please upload images, PDFs, or documents.');
        return;
      }

      setUploadedFile(file);
      toast.success('File uploaded successfully!');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['subject'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('contact', new Blob([JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      })], { type: 'application/json' }));

      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      await contactAPI.submit(formData);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
      setUploadedFile(null);
      setCurrentStep(1);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
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
      toast.success(`Email copied successfully!\n${text}`, {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: isDarkMode ? '#10b981' : '#059669',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
          textAlign: 'center',
          whiteSpace: 'pre-line',
        },
      });

      // Reset copied state after 3 seconds
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch (err) {
      console.error('Failed to copy email:', err);
      toast.error('Failed to copy email. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: isDarkMode ? '#ef4444' : '#dc2626',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
        },
      });
    }
  };

  const handleMouseMove = (e) => {
    if (meshRef.current) {
      const rect = meshRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'rajsingh170901@gmail.com',
      href: null, // Remove mailto link
      isCopyable: true, // Add flag for copy functionality
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: '+91-8840082361',
      href: 'tel:+918840082361',
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: 'Bangalore, India',
      href: 'https://maps.app.goo.gl/bJPazojCxso4A1Kj9',
    },
  ];

  return (
    <section id="contact" className={`relative py-20 overflow-hidden ${
      isDarkMode
        ? 'bg-gradient-to-b from-black via-black to-black'
        : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
    }`}>
      {/* Premium Animated Background Elements - blended with F1 background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* F1 Background Extension */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        {/* Large floating gradient orbs */}
        <motion.div
          className="absolute top-20 left-12 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-indigo-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-20 right-16 w-[32rem] h-[32rem] bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1.2, 0.9, 1.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/12 via-purple-600/8 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -60, 0],
            scale: [0.9, 1.25, 0.9],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5,
            ease: "easeInOut",
          }}
        />

        {/* Animated particle sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -600, -600],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "linear",
            }}
          />
        ))}

        {/* Large radial pulse layers */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-[40rem] h-[40rem] bg-gradient-radial from-blue-400/8 to-transparent rounded-full"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/3 w-[36rem] h-[36rem] bg-gradient-radial from-purple-500/10 to-transparent rounded-full"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.12, 0.05, 0.12],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Subtle wave motion overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Get In Touch"
          subtitle="Feel free to reach out for collaborations or just a friendly hello"
          className={isDarkMode ? "text-white" : "text-gray-900"}
        />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
              transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <div>
              <h3 className={`text-3xl font-bold mb-6 bg-clip-text text-transparent ${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-white'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-gray-900'
              }`}>
                Let's Talk
              </h3>
              <p className={`mb-8 text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </p>
            </div>

            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={`contact-info-${info.label}-${index}-${info.value}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-white/10 via-cyan-500/5 to-purple-500/5 border border-cyan-400/30 hover:border-cyan-400/60'
                      : 'bg-gradient-to-br from-white/80 via-blue-50/50 to-purple-50/50 border border-blue-300/40 hover:border-blue-400/60'
                  }`}>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all"></div>
                        <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                          <info.icon className="text-white text-2xl" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                          isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                        }`}>{info.label}</p>
                        {info.isCopyable ? (
                          <motion.button
                            onClick={() => copyToClipboard(info.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                              isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 border border-cyan-400/20 hover:border-cyan-400/40'
                                : 'bg-gray-50 hover:bg-gray-100 border border-blue-200/50 hover:border-blue-300/70'
                            }`}
                            aria-label="Copy email to clipboard"
                            title="Click to copy email to clipboard"
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-lg font-medium ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {info.value}
                              </span>
                              <motion.div
                                animate={copiedEmail ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`p-2 rounded-md ${
                                  copiedEmail
                                    ? isDarkMode
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-green-100 text-green-600'
                                    : isDarkMode
                                      ? 'bg-cyan-500/20 text-cyan-400'
                                      : 'bg-blue-100 text-blue-600'
                                }`}
                              >
                                {copiedEmail ? (
                                  <FaCheck className="w-4 h-4" />
                                ) : (
                                  <FaCopy className="w-4 h-4" />
                                )}
                              </motion.div>
                            </div>
                          </motion.button>
                        ) : info.href ? (
                          <a
                            href={info.href}
                            className={`block p-3 rounded-lg transition-all duration-300 ${
                              isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 border border-cyan-400/20 hover:border-cyan-400/40 text-white hover:text-cyan-400'
                                : 'bg-gray-50 hover:bg-gray-100 border border-blue-200/50 hover:border-blue-300/70 text-gray-900 hover:text-blue-600'
                            }`}
                          >
                            <span className="text-lg font-medium">{info.value}</span>
                          </a>
                        ) : (
                          <div className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-white/5 border border-cyan-400/20' : 'bg-gray-50 border border-blue-200/50'
                          }`}>
                            <span className={`text-lg font-medium ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>{info.value}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
              transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
              }
            }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-2xl ${
              isDarkMode
                ? 'bg-gradient-to-br from-white/10 via-cyan-500/5 to-purple-500/5 border border-cyan-400/30'
                : 'bg-gradient-to-br from-white/80 via-blue-50/50 to-purple-50/50 border border-blue-300/40'
            }`}>
              {/* Step Indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={`contact-step-${step}`} className="flex items-center">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          step <= currentStep
                            ? `bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400 text-white`
                            : isDarkMode
                              ? 'border-gray-600 text-gray-600'
                              : 'border-gray-400 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {step < currentStep ? (
                          <FaCheck className="text-sm" />
                        ) : (
                          <span className="text-sm font-semibold">{step}</span>
                        )}
                      </motion.div>
                      {step < 3 && (
                        <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                          step < currentStep
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                            : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
                        Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          {...register('name')}
                          className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-white placeholder-gray-400 backdrop-blur-sm ${
                            errors.name && touchedFields.name
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-cyan-400/30'
                          }`}
                          placeholder="Your name"
                        />
                        {touchedFields.name && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {errors.name ? (
                              <FaTimes className="w-4 h-4 text-red-400" />
                            ) : (
                              <FaCheck className="w-4 h-4 text-green-400" />
                            )}
                          </motion.div>
                        )}
                      </div>
                      {errors.name && touchedFields.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                      {watchedFields.name && !errors.name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-400 text-sm mt-1"
                        >
                          ✓ Name looks good!
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
                        Email *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          {...register('email')}
                          className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-white placeholder-gray-400 backdrop-blur-sm ${
                            errors.email && touchedFields.email
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-cyan-400/30'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {touchedFields.email && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {errors.email ? (
                              <FaTimes className="w-4 h-4 text-red-400" />
                            ) : (
                              <FaCheck className="w-4 h-4 text-green-400" />
                            )}
                          </motion.div>
                        )}
                      </div>
                      {errors.email && touchedFields.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                      {watchedFields.email && !errors.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-400 text-sm mt-1"
                        >
                          ✓ Email looks good!
                        </motion.p>
                      )}
                    </div>



                  </motion.div>
                )}

                {/* Step 2: Subject */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
                        Subject *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="subject"
                          {...register('subject')}
                          className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-white placeholder-gray-400 backdrop-blur-sm ${
                            errors.subject && touchedFields.subject
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-cyan-400/30'
                          }`}
                          placeholder="What's this about?"
                        />
                        {touchedFields.subject && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {errors.subject ? (
                              <FaTimes className="w-4 h-4 text-red-400" />
                            ) : (
                              <FaCheck className="w-4 h-4 text-green-400" />
                            )}
                          </motion.div>
                        )}
                      </div>
                      {errors.subject && touchedFields.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.subject.message}
                        </motion.p>
                      )}
                      {watchedFields.subject && !errors.subject && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-400 text-sm mt-1"
                        >
                          ✓ Subject looks good!
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Message */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
                        Message *
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          {...register('message')}
                          rows={5}
                          className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-white placeholder-gray-400 backdrop-blur-sm resize-none ${
                            errors.message && touchedFields.message
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-cyan-400/30'
                          }`}
                          placeholder="Your message..."
                        />
                        {touchedFields.message && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-3 top-4"
                          >
                            {errors.message ? (
                              <FaTimes className="w-4 h-4 text-red-400" />
                            ) : (
                              <FaCheck className="w-4 h-4 text-green-400" />
                            )}
                          </motion.div>
                        )}
                      </div>
                      {errors.message && touchedFields.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.message.message}
                        </motion.p>
                      )}
                      {watchedFields.message && !errors.message && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-400 text-sm mt-1"
                        >
                          ✓ Message looks good!
                        </motion.p>
                      )}

                      {/* File Upload Section */}
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
                          Attachment (Optional)
                        </label>
                        <div className="relative">
                          <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileUpload}
                            accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                              uploadedFile
                                ? 'border-green-400 bg-green-500/10'
                                : 'border-cyan-400/30 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            {uploadedFile ? (
                              <div className="flex items-center space-x-3">
                                <FaFileAlt className="w-5 h-5 text-green-400" />
                                <div className="flex-1 text-left">
                                  <p className="text-sm font-medium text-white truncate">{uploadedFile.name}</p>
                                  <p className="text-xs text-gray-400">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeFile();
                                  }}
                                  className="p-1 hover:bg-red-500/20 rounded"
                                >
                                  <FaTimes className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <FaUpload className="w-5 h-5 text-cyan-400" />
                                <span className="text-white">Click to upload file (max 5MB)</span>
                              </div>
                            )}
                          </label>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Supported formats: Images, PDF, TXT, DOC, DOCX
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className={`flex items-center justify-center space-x-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      <FaArrowLeft />
                      <span>Previous</span>
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className={`flex items-center justify-center space-x-3 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ml-auto disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:shadow-cyan-500/50'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-blue-500/50'
                      }`}
                    >
                      <span>Next</span>
                      <FaArrowRight />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center justify-center space-x-3 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ml-auto disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:shadow-cyan-500/50'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-blue-500/50'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="loader-small"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-lg" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Quick Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className={`backdrop-blur-sm rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-white/10 via-red-500/5 to-pink-500/5 border border-red-400/30 hover:border-red-400/60'
                  : 'bg-gradient-to-br from-white/80 via-red-50/50 to-pink-50/50 border border-red-300/40 hover:border-red-400/60'
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">
                  <FaEnvelope className={`${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>
                <h4 className={`text-lg font-bold mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Contact
                </h4>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Send your email for a prompt response
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                if (email) {
                  setIsSubmitting(true);
                  try {
                    // Send email to user
                    await contactAPI.sendInterestEmail({ email });
                    toast.success('Thank you for showing interest! We\'ve sent you a confirmation email.', {
                      duration: 4000,
                      position: 'bottom-center',
                      style: {
                        background: isDarkMode ? '#10b981' : '#059669',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '16px',
                        fontWeight: '500',
                      },
                    });
                    e.target.reset();
                  } catch (error) {
                    toast.error('Failed to send email. Please try again.', {
                      duration: 3000,
                      position: 'bottom-center',
                      style: {
                        background: isDarkMode ? '#ef4444' : '#dc2626',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '16px',
                        fontWeight: '500',
                      },
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }
              }} className="space-y-3">
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                  className={`w-full px-3 py-2 bg-white/5 border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all text-white placeholder-gray-400 backdrop-blur-sm text-sm ${
                    isDarkMode ? 'border-red-400/30' : 'border-red-300/40'
                  }`}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 font-semibold rounded-lg shadow-lg transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white hover:shadow-red-500/50'
                      : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white hover:shadow-red-500/50'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loader-small"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Drop a 👍</span>
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
