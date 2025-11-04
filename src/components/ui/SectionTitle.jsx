import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`text-center mb-16 ${className || ''}`}
    >
      <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text mb-4 drop-shadow-lg">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
          {subtitle}
        </p>
      )}
      <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mx-auto mt-6 rounded-full shadow-lg"></div>
    </motion.div>
  );
};

export default SectionTitle;
