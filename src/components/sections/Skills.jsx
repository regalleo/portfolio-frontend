import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";
import { useTheme } from "../../context/ThemeContext";
import {
  FaJava,
  FaPython,
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
} from "react-icons/fa";
import {
  SiSpring,
  SiMongodb,
  SiMysql,
  SiApachekafka,
  SiDocker,
  SiApachespark,
  SiTailwindcss,
  SiPostman,
  SiHibernate,
  SiDjango,
  SiFastapi,
  SiHuggingface,
  SiOpenai,
  SiAnthropic,
  SiGooglecloud,
  SiTensorflow,
  SiPytorch,
  SiLangchain,
} from "react-icons/si";
import { FaBrain, FaRobot } from "react-icons/fa";

const Skills = () => {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("coding");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [animatedCategories, setAnimatedCategories] = useState(new Set());

  const skillCategories = {
    coding: {
      label: "Backend & Programming",
      color: "from-blue-500 to-cyan-500",
      percentage: "90%",
      skills: [
        { icon: FaJava, name: "Java", size: "lg", color: "#F89820" },
        { icon: FaPython, name: "Python", size: "lg", color: "#FFD43B" },
        { icon: SiSpring, name: "Spring Boot", size: "md", color: "#6DB33F" },
        { icon: SiHibernate, name: "Hibernate", size: "md", color: "#59666C" },
        { icon: SiDjango, name: "Django", size: "md", color: "#092E20" },
        { icon: SiFastapi, name: "FastAPI", size: "md", color: "#009688" },
      ],
    },
    design: {
      label: "Design & Frontend",
      color: "from-pink-500 to-rose-500",
      percentage: "85%",
      skills: [
        { icon: FaHtml5, name: "HTML5", size: "lg", color: "#E34F26" },
        { icon: FaCss3Alt, name: "CSS3", size: "lg", color: "#1572B6" },
        { icon: FaJs, name: "JavaScript", size: "lg", color: "#F7DF1E" },
        { icon: FaReact, name: "React JS", size: "lg", color: "#61DAFB" },
        { icon: SiTailwindcss, name: "Tailwind CSS", size: "md", color: "#06B6D4" },
      ],
    },
    data: {
      label: "Data & DevOps",
      color: "from-purple-500 to-indigo-500",
      percentage: "95%",
      skills: [
        { icon: SiMongodb, name: "MongoDB", size: "lg", color: "#47A248" },
        { icon: SiMysql, name: "MySQL", size: "lg", color: "#4479A1" },
        { icon: SiApachekafka, name: "Apache Kafka", size: "md", color: "#FFFFFF" },
        { icon: SiApachespark, name: "Apache Spark", size: "md", color: "#E25A1C" },
        { icon: SiDocker, name: "Docker", size: "md", color: "#2496ED" },
      ],
    },
    ai: {
      label: "AI & Machine Learning",
      color: "from-emerald-500 to-teal-500",
      percentage: "80%",
      skills: [
        { icon: FaBrain, name: "LLM", size: "lg", color: "#FF6F00" },
        { icon: FaRobot, name: "RAG", size: "lg", color: "#EE4C2C" },
        { icon: SiLangchain, name: "LangChain", size: "md", color: "#F7931E" },
        { icon: SiHuggingface, name: "Hugging Face", size: "md", color: "#FFD21E" },
        { icon: SiOpenai, name: "OpenAI API", size: "md", color: "#412991" },
        { icon: SiAnthropic, name: "Anthropic", size: "md", color: "#D4AF37" },
        { icon: SiGooglecloud, name: "Google AI", size: "md", color: "#4285F4" },
        { icon: SiTensorflow, name: "TensorFlow", size: "md", color: "#FF6F00" },
        { icon: SiPytorch, name: "PyTorch", size: "md", color: "#EE4C2C" },
      ],
    },
  };

  const currentCategory = skillCategories[selectedCategory];

  return (
    <section id="skills" className={`relative py-20 overflow-hidden ${
      isDarkMode ? 'bg-transparent' : 'bg-gray-50'
    }`}>
      {/* Seamless Background Transition */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle connecting elements */}
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/8 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-500/6 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{ duration: 30, repeat: Infinity, delay: 8 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Technical Expertise"
          subtitle="Comprehensive skill set across multiple domains"
          className={`text-center mb-16 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        />

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {Object.entries(skillCategories).map(([key, category]) => (
            <motion.button
              key={`skill-category-${key}`}
              onClick={() => setSelectedCategory(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedCategory === key
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-blue-500/25`
                  : isDarkMode
                    ? "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 backdrop-blur-sm shadow-sm"
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Display */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Category Title */}
          <motion.h2
            className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${currentCategory.color} bg-clip-text text-transparent mb-6`}
          >
            {currentCategory.label}
          </motion.h2>

          {/* Skills Grid */}
          <motion.div
            className={`grid gap-8 mb-12 ${
              selectedCategory === "coding"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                : selectedCategory === "design"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                : selectedCategory === "data"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                : "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9"
            } justify-items-center`}
          >
            {currentCategory.skills.map((skill, idx) => {
              const IconComponent = skill.icon;

              return (
                <motion.div
                  key={`skill-${skill.name}-${idx}`}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative cursor-pointer"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110" />

                  {/* Icon container */}
                  <div className="relative bg-transparent backdrop-blur-none rounded-2xl p-6 border-none group-hover:bg-white/5 transition-all duration-300 shadow-none group-hover:shadow-lg">
                    <motion.div
                      className="text-4xl transition-all duration-300"
                      animate={{
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: idx * 0.2,
                        ease: "easeInOut"
                      }}
                    >
                      <IconComponent style={{ color: skill.color || 'white' }} />
                    </motion.div>
                  </div>

                  {/* Skill name */}
                  <motion.p
                    className={`mt-4 font-semibold text-sm transition-colors duration-300 ${
                      isDarkMode
                        ? 'text-gray-300 group-hover:text-white'
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                  >
                    {skill.name}
                  </motion.p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Category Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <p className={`text-lg leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedCategory === "coding" &&
                "Building robust backend systems with modern frameworks, ORM tools, and scalable architectures for enterprise applications."}
              {selectedCategory === "design" &&
                "Creating responsive, interactive user interfaces with modern web technologies and design principles."}
              {selectedCategory === "data" &&
                "Managing data pipelines, databases, and containerized deployments for efficient data processing and DevOps workflows."}
              {selectedCategory === "ai" &&
                "Developing intelligent systems with large language models, retrieval-augmented generation, and machine learning frameworks for AI-powered applications."}
            </p>
          </motion.div>
        </motion.div>

        {/* Skill Proficiency Rings */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {/* Interactive Stats Cards */}
          <motion.div
            whileHover={{ y: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative text-center p-4 transition-all duration-300 cursor-pointer"
          >
            <motion.div
              className={`text-3xl font-bold bg-clip-text text-transparent mb-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-cyan-300 group-hover:to-blue-400'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-blue-500 group-hover:to-purple-500'
              }`}
              whileHover={{ scale: 1.1, textShadow: isDarkMode ? "0 0 20px rgba(34, 211, 238, 0.5)" : "0 0 20px rgba(59, 130, 246, 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              25+
            </motion.div>
            <motion.h3
              className={`font-medium text-sm mb-1 transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-200 group-hover:text-white'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}
              whileHover={{ y: -2 }}
            >
              Total Technologies
            </motion.h3>
            <motion.p
              className={`text-xs transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-400 group-hover:text-slate-300'
                  : 'text-gray-500 group-hover:text-gray-600'
              }`}
              whileHover={{ y: -1 }}
            >
              Across All Domains
            </motion.p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative text-center p-4 transition-all duration-300 cursor-pointer"
          >
            <motion.div
              className={`text-3xl font-bold bg-clip-text text-transparent mb-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-green-300 group-hover:to-emerald-400'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-green-500 group-hover:to-emerald-500'
              }`}
              whileHover={{ scale: 1.1, textShadow: isDarkMode ? "0 0 20px rgba(16, 185, 129, 0.5)" : "0 0 20px rgba(16, 185, 129, 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              5+
            </motion.div>
            <motion.h3
              className={`font-medium text-sm mb-1 transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-200 group-hover:text-white'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}
              whileHover={{ y: -2 }}
            >
              Years Experience
            </motion.h3>
            <motion.p
              className={`text-xs transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-400 group-hover:text-slate-300'
                  : 'text-gray-500 group-hover:text-gray-600'
              }`}
              whileHover={{ y: -1 }}
            >
              Professional Development as 5+ years into writing code...and nearly 1year industry experience in MNC
            </motion.p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative text-center p-4 transition-all duration-300 cursor-pointer"
          >
            <motion.div
              className={`text-3xl font-bold bg-clip-text text-transparent mb-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-purple-300 group-hover:to-indigo-400'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-purple-500 group-hover:to-indigo-500'
              }`}
              whileHover={{ scale: 1.1, textShadow: isDarkMode ? "0 0 20px rgba(147, 51, 234, 0.5)" : "0 0 20px rgba(147, 51, 234, 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              87%
            </motion.div>
            <motion.h3
              className={`font-medium text-sm mb-1 transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-200 group-hover:text-white'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}
              whileHover={{ y: -2 }}
            >
              Avg Proficiency
            </motion.h3>
            <motion.p
              className={`text-xs transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-400 group-hover:text-slate-300'
                  : 'text-gray-500 group-hover:text-gray-600'
              }`}
              whileHover={{ y: -1 }}
            >
              Across All Skills
            </motion.p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative text-center p-4 transition-all duration-300 cursor-pointer"
          >
            <motion.div
              className={`text-3xl font-bold bg-clip-text text-transparent mb-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-pink-300 group-hover:to-rose-400'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-pink-500 group-hover:to-rose-500'
              }`}
              animate={{ rotate: 5 }}
              whileHover={{ scale: 1.1, textShadow: isDarkMode ? "0 0 20px rgba(236, 72, 153, 0.5)" : "0 0 20px rgba(236, 72, 153, 0.3)", rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ∞
            </motion.div>
            <motion.h3
              className={`font-medium text-sm mb-1 transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-200 group-hover:text-white'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}
              whileHover={{ y: -2 }}
            >
              Learning Mindset
            </motion.h3>
            <motion.p
              className={`text-xs transition-colors duration-300 ${
                isDarkMode
                  ? 'text-slate-400 group-hover:text-slate-300'
                  : 'text-gray-500 group-hover:text-gray-600'
              }`}
              whileHover={{ y: -1 }}
            >
              Always Evolving
            </motion.p>
          </motion.div>
          {/* Interactive Proficiency Rings */}
          {Object.entries(skillCategories).map(([key, category], idx) => (
            <motion.div
              key={`proficiency-ring-${key}-${idx}`}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative text-center p-4 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => {
                setHoveredCategory(key);
                setAnimatedCategories(prev => new Set([...prev, key]));
              }}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative w-24 h-24 mx-auto mb-3">
                {/* Background ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    className="group-hover:stroke-slate-500/50 transition-colors duration-300"
                  />
                  {/* Progress ring */}
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={`url(#gradient-${key})`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: animatedCategories.has(key) ? parseInt(category.percentage) / 100 : 0
                    }}
                    transition={{
                      duration: animatedCategories.has(key) ? 0.8 : 0,
                      ease: "easeOut"
                    }}
                  />
                </svg>
                {/* Gradient definitions */}
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <defs>
                    <linearGradient id={`gradient-${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={
                        key === 'coding' ? '#3b82f6' :
                        key === 'design' ? '#ec4899' :
                        key === 'data' ? '#8b5cf6' :
                        '#10b981'
                      } />
                      <stop offset="100%" stopColor={
                        key === 'coding' ? '#06b6d4' :
                        key === 'design' ? '#f43f5e' :
                        key === 'data' ? '#6366f1' :
                        '#14b8a6'
                      } />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className={`text-2xl font-bold transition-colors duration-300 ${
                      isDarkMode
                        ? 'text-white group-hover:text-white'
                        : 'text-gray-900 group-hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {category.percentage}
                  </motion.span>
                </div>
              </div>
              <motion.h3
                className={`font-medium text-sm mb-1 transition-colors duration-300 ${
                  isDarkMode
                    ? 'text-slate-200 group-hover:text-white'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}
                whileHover={{ y: -2 }}
              >
                {category.label}
              </motion.h3>
              <motion.p
                className={`text-xs transition-colors duration-300 ${
                  isDarkMode
                    ? 'text-slate-400 group-hover:text-slate-300'
                    : 'text-gray-500 group-hover:text-gray-600'
                }`}
                whileHover={{ y: -1 }}
              >
                {category.skills.length} Technologies
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
