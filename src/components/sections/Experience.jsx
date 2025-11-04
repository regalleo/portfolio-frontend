import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import { useExperience } from '../../hooks/useAPI';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Experience = () => {
  const { data: experiences, isLoading, error } = useExperience();
  const { isDarkMode } = useTheme();

  if (isLoading) {
    return (
      <section id="experience" className="py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-gray-400">Loading experiences...</div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('API Error:', error);
    return (
      <section id="experience" className="py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-red-500">
          <p>Error loading experiences: {error?.message}</p>
        </div>
      </section>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <section id="experience" className="py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>No experiences found</p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Split experiences into groups for different backgrounds
  const experienceGroups = [
    experiences.slice(0, 1), // First group - f1_1.png
    experiences.slice(1, 2), // Second group - f1_2.png
    experiences.slice(2, 4), // Third group - f1_3.jpg
  ];

  const backgroundImages = [
    'url(/f1_1.png)',
    'url(/f1_2.png)',
    'url(/f1_3.jpg)',
  ];

  return (
    <>
      {/* Main Experience Sections with F1 Backgrounds */}
      {experienceGroups.map((group, groupIndex) => (
        <section
          key={groupIndex}
          id={groupIndex === 0 ? 'experience' : undefined}
          className="relative py-24 overflow-hidden transition-all duration-1000 min-h-screen"
          style={{
            backgroundImage: backgroundImages[groupIndex],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Lighter overlay - lets images show through */}
          <div className="absolute inset-0 bg-black/50 z-0" />

          {/* Smooth gradient overlay for text readability */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </div>

          {/* Subtle animated accent */}
          <motion.div
            className="absolute inset-0 z-0 bg-gradient-to-b from-red-500/5 via-transparent to-red-500/5"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title only on first section */}
            {groupIndex === 0 && (
              <SectionTitle
                title="Experience"
                subtitle="My professional journey and education"
                className={`text-center mb-16 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              />
            )}

            <div className="relative space-y-12">
              {group.map((exp, index) => {
                const actualIndex = experiences.indexOf(exp);
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center"
                  >
                    {/* Timeline Dot - Left side for desktop */}
                    <div className="hidden md:flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-red-600 flex items-center justify-center shadow-2xl z-10 flex-shrink-0 border-2 border-white/40 hover:shadow-red-500/50 transition-all"
                      >
                        <span className="text-white font-bold text-lg">
                          {actualIndex + 1}
                        </span>
                      </motion.div>

                      {/* Connecting line between dots */}
                      {index < group.length - 1 && (
                        <div className="w-1 h-32 bg-gradient-to-b from-red-500/70 via-orange-500/50 to-transparent mt-4 shadow-lg shadow-red-500/40"></div>
                      )}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.02, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-lg border-2 border-red-500/50 hover:border-red-500/80 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <h3 className={`text-3xl font-bold bg-clip-text text-transparent mb-2 ${
                              isDarkMode
                                ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300'
                                : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800'
                            }`}>
                              {exp.position}
                            </h3>
                            <p className={`text-xl font-bold mb-2 ${
                              isDarkMode ? 'text-red-400' : 'text-red-600'
                            }`}>
                              {exp.company}
                            </p>
                          </div>
                          {exp.current && (
                            <motion.span
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="px-4 py-2 bg-gradient-to-r from-green-500/40 to-emerald-500/30 text-green-200 text-xs font-bold rounded-full border-2 border-green-500/60 whitespace-nowrap"
                            >
                              ● Current
                            </motion.span>
                          )}
                        </div>

                        <div className={`flex flex-wrap gap-6 mb-6 text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <FaCalendar className="text-red-400 text-lg" />
                            <span>
                              {formatDate(exp.startDate)} -{' '}
                              {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center space-x-3">
                              <FaMapMarkerAlt className="text-red-400 text-lg" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>

                        <p className={`mb-6 leading-relaxed text-base ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {exp.description}
                        </p>

                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="pt-6 border-t border-red-500/30">
                            <h4 className={`font-bold mb-4 text-sm uppercase tracking-widest ${
                              isDarkMode ? 'text-white text-red-300' : 'text-gray-900 text-red-600'
                            }`}>
                              🏁 Key Achievements
                            </h4>
                            <ul className="space-y-3">
                              {exp.achievements.map((achievement, i) => (
                                <motion.li
                                  key={`achievement-${exp.id}-${i}-${achievement.slice(0, 10)}`}
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  viewport={{ once: true }}
                                  className="flex items-start space-x-3 group hover:translate-x-2 transition-transform"
                                >
                                  <span className="text-red-400 mt-1 text-lg flex-shrink-0 font-bold">
                                    ✓
                                  </span>
                                  <span className={`transition-colors text-sm leading-relaxed ${
                                    isDarkMode
                                      ? 'text-gray-300 group-hover:text-gray-100'
                                      : 'text-gray-700 group-hover:text-gray-900'
                                  }`}>
                                    {achievement}
                                  </span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Timeline Dot - Mobile version */}
                    <div className="md:hidden flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/40"
                      >
                        <span className="text-white font-bold">
                          {actualIndex + 1}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Smooth transition gradient */}
          {groupIndex < experienceGroups.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none z-5" />
          )}

          {/* Seamless blend into projects section - extend background */}
          {groupIndex === experienceGroups.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none z-5" />
          )}
        </section>
      ))}

    </>
  );
};

export default Experience;
