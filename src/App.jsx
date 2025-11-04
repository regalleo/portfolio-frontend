import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import TechStack from './components/sections/TechStack';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import Chatbot from './components/ui/Chatbot';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // 4-second loading time
    const totalDuration = 2500; // 2.5 seconds
    const intervalTime = 40; // Update every 40ms
    const steps = totalDuration / intervalTime; // 100 steps
    const increment = 100 / steps; // Progress per step

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <LoadingScreen progress={Math.floor(loadingProgress)} />;
  }

  return (
    <div className="relative overflow-x-hidden">
      <Navbar />
      <main id="main-content">
        <Hero />
        <TechStack />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <Chatbot />
    </div>
  );
}


// FIXED Loading Screen with Working Shine
// LoadingScreen with smaller percentage
// LoadingScreen - Entire name animates together
// LoadingScreen - Slides from bottom to center like ZEEJ
// LoadingScreen - Starts slightly below center, slides to perfect center
const LoadingScreen = ({ progress }) => {
  const name = "RAJ SHEKHAR";
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="absolute inset-0 bg-black"></div>

      {/* Name - Starts slightly below, slides to center */}
      <motion.div 
        className="relative z-10 flex items-center justify-center w-full px-4"
        initial={{ 
          opacity: 0, 
          y: 150
        }}
        animate={{ 
          opacity: 1, 
          y: 0
        }}
        transition={{
          duration: 2.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 1 }
        }}
      >
        <div className="flex items-center justify-center">
          {name.split('').map((letter, index) => (
            <div
              key={index}
              className={letter === ' ' ? 'w-4 md:w-8' : ''}
            >
              {letter !== ' ' && (
                <div 
                  className="zeej-letter"
                  data-letter={letter}
                >
                  {letter}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.50 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-4xl md:text-6xl font-black text-white"
      >
        {progress}%
      </motion.div>
    </motion.div>
  );
};







const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default App;
