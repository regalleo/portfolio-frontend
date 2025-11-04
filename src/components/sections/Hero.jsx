import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const Hero = () => {
  const { isDarkMode } = useTheme();
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);

  const roles = ["Software Developer", "Big Data Engineer"];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  useEffect(() => {
    const currentRole = roles[loopIndex % roles.length];
    const shouldDelete = isDeleting;

    if (!shouldDelete && currentIndex < currentRole.length) {
      // Typing
      setTimeout(() => {
        setDisplayText(currentRole.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typingSpeed);
    } else if (shouldDelete && currentIndex > 0) {
      // Deleting
      setTimeout(() => {
        setDisplayText(currentRole.substring(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      }, deletingSpeed);
    } else if (!shouldDelete && currentIndex === currentRole.length) {
      // Pause before deleting
      setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (shouldDelete && currentIndex === 0) {
      // Continue looping infinitely
      setIsDeleting(false);
      setLoopIndex(loopIndex + 1);
    }
  }, [currentIndex, isDeleting, loopIndex, roles]);

  return (
    <section
      id="home"
      className={`relative min-h-screen overflow-hidden flex items-center justify-center pt-20 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
      }`}
    >
      {/* Premium Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating gradient orbs */}
        <motion.div
          className={`absolute top-20 left-12 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-purple-600/20 via-indigo-500/15 to-transparent'
              : 'bg-gradient-to-br from-blue-400/15 via-cyan-300/10 to-transparent'
          }`}
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />

        <motion.div
          className={`absolute bottom-20 right-16 w-[32rem] h-[32rem] rounded-full blur-3xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent'
              : 'bg-gradient-to-br from-green-400/12 via-emerald-300/8 to-transparent'
          }`}
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
            ease: "easeInOut"
          }}
        />

        <motion.div
          className={`absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-pink-500/12 via-purple-600/8 to-transparent'
              : 'bg-gradient-to-br from-purple-400/10 via-violet-300/6 to-transparent'
          }`}
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
            ease: "easeInOut"
          }}
        />

        {/* Animated particle sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`hero-sparkle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${
              isDarkMode ? 'bg-white/40' : 'bg-gray-600/30'
            }`}
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
          className={`absolute top-1/2 left-1/4 w-[40rem] h-[40rem] rounded-full ${
            isDarkMode
              ? 'bg-gradient-radial from-blue-400/8 to-transparent'
              : 'bg-gradient-radial from-blue-300/6 to-transparent'
          }`}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className={`absolute bottom-1/4 right-1/3 w-[36rem] h-[36rem] rounded-full ${
            isDarkMode
              ? 'bg-gradient-radial from-purple-500/10 to-transparent'
              : 'bg-gradient-radial from-purple-300/8 to-transparent'
          }`}
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
          className={`absolute inset-0 bg-gradient-to-r ${
            isDarkMode
              ? 'from-transparent via-white/[0.02] to-transparent'
              : 'from-transparent via-gray-600/[0.01] to-transparent'
          }`}
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


      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* LEFT COLUMN - TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block"
            >
              <div className="px-6 py-3 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm text-cyan-300 font-semibold text-sm shadow-lg shadow-cyan-500/20">
                ✨ Dear Stranger
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-3"
            >
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-2xl hero-title ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Hi, I am{" "}
                <span className={`text-transparent bg-clip-text animate-pulse ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400'
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                }`}>
                  Raj Shekhar Singh
                </span>
              </h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={`text-xl md:text-2xl lg:text-3xl font-bold mt-2 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}
              >
                {displayText}
                <span className={`animate-pulse ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>|</span>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`text-lg md:text-xl max-w-lg leading-relaxed drop-shadow-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
"Full-stack engineer crafting scalable data pipelines and Gen-AI applications. Turning chaos into clarity, one line of code at a time."
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-8"
            >
              <motion.a
                href="#contact"
                whileHover={{
                  scale: 1.05,
                  boxShadow: isDarkMode ? "0 0 30px rgba(34, 211, 238, 0.5)" : "0 0 30px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 font-bold rounded-xl shadow-2xl transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-500/30 hover:shadow-cyan-400/50'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/30 hover:shadow-blue-400/40'
                }`}
              >
                Contact Me
              </motion.a>

              <motion.a
                href="#projects"
                whileHover={{
                  scale: 1.05,
                  boxShadow: isDarkMode ? "0 0 30px rgba(168, 85, 247, 0.5)" : "0 0 30px rgba(147, 51, 234, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 border-2 backdrop-blur-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg ${
                  isDarkMode
                    ? 'border-purple-400/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 hover:bg-purple-500/20 shadow-purple-500/20'
                    : 'border-purple-400/60 bg-gradient-to-r from-purple-100/50 to-pink-100/50 text-purple-700 hover:bg-purple-200/30 shadow-purple-400/20'
                }`}
              >
                Explore My Work
                <span className="text-xl">→</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - 3D MODEL */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative h-full flex items-center justify-center"
          >
            {/* 3D Model Viewer */}
            <motion.div
              className="relative w-64 h-80 md:w-80 md:h-96 overflow-hidden cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <model-viewer
                src="/3d1.glb"
                ios-src="/3d.usdz"
                alt="3D Model"
                auto-rotate="true"
                camera-controls="true"
                disable-tap="false"
                shadow-intensity="1"
                shadow-softness="0.5"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                }}
              ></model-viewer>

              {/* Aesthetic Dialogue Box */}
              <motion.div
                className="absolute top-8 left-4 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg border border-cyan-400/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                style={{
                  transform: "translateX(-50%)",
                }}
              >
                About me? click
                {/* Speech Bubble Tail */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/50"></div>
              </motion.div>
            </motion.div>

            {/* CONTACT BUTTON - Below 3D Model */}
            <motion.div
              className="absolute bottom-6 -right-2 z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                <motion.a
                  href="#contact"
                  className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-cyan-400 bg-gradient-to-br from-cyan-500 to-purple-600 shadow-2xl flex items-center justify-center cursor-pointer"
                  animate={{
                    boxShadow: [
                      "0 0 25px rgba(34, 211, 238, 0.6)",
                      "0 0 50px rgba(168, 85, 247, 0.8)",
                      "0 0 25px rgba(34, 211, 238, 0.6)",
                    ],
                    rotate: [0, -3, 3, -3, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src="/bitmoji.png"
                      alt="Contact Me"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.a>
              </div>

              {/* Floating Particles Around Button */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`floating-particle-${i}`}
                  className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i / 5) * Math.PI * 2) * 45],
                    y: [0, Math.sin((i / 5) * Math.PI * 2) * 45],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`text-3xl drop-shadow-lg ${
            isDarkMode ? 'text-cyan-400' : 'text-blue-600'
          }`}
        >
          ↓
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`text-sm mt-2 font-medium ${
            isDarkMode ? 'text-cyan-300' : 'text-blue-500'
          }`}
        >
          Scroll Down
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
