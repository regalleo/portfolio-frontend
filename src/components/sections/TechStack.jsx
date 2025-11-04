import React from "react";
import { motion } from "framer-motion";
import {
  FaGitAlt,
  FaPython,
  FaCss3Alt,
  FaHtml5,
  FaJs,
  FaReact,
  FaJava,
  FaGithub,
  FaCode,
} from "react-icons/fa";

import {
  SiSpring,
  SiMysql,
  SiMongodb,
  SiApachekafka,
  SiDocker,
  SiApachespark,
  SiPostman,
  SiIntellijidea,
  SiTensorflow,
  SiLinux,
  SiDjango,
  SiTailwindcss,
  SiFastapi,
  SiHibernate,
} from "react-icons/si";
import { FaBolt } from "react-icons/fa";

const TechStack = () => {
  const technologies = [
    { icon: FaJava, name: "Java" },
    { icon: SiSpring, name: "Spring Boot" },
    { icon: FaReact, name: "React.js" },
    { icon: FaJs, name: "JavaScript" },
    { icon: FaPython, name: "Python" },
    { icon: FaHtml5, name: "HTML5" },
    { icon: FaCss3Alt, name: "CSS3" },
    { icon: SiMysql, name: "MySQL" },
    { icon: SiMongodb, name: "MongoDB" },
    { icon: SiApachekafka, name: "Apache Kafka" },
    { icon: SiApachespark, name: "Apache Spark" },
    { icon: SiDocker, name: "Docker" },
    { icon: FaGitAlt, name: "Git" },
    { icon: FaGithub, name: "GitHub" },
    { icon: SiPostman, name: "Postman" },
    { icon: SiIntellijidea, name: "IntelliJ IDEA" },
    { icon: SiTensorflow, name: "TensorFlow" },
    { icon: FaCode, name: "REST API" },
    { icon: SiLinux, name: "Linux" },
    { icon: SiDjango, name: "Django" },
    { icon: SiTailwindcss, name: "Tailwind" },
    { icon: SiFastapi, name: "FastAPI" },
    { icon: FaBolt, name: "n8n" },
    { icon: SiHibernate, name: "Hibernate" },
  ];

  return (
    <section className="relative py-16 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Scrolling Container */}
        <div className="relative overflow-hidden py-8">
          <motion.div
            className="flex space-x-16"
            animate={{
              x: [0, -140 * technologies.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            style={{ width: `${technologies.length * 160}px` }}
          >
            {[...technologies, ...technologies].map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <motion.div
                  key={`${tech.name}-${index}`}
                  className="flex-shrink-0 flex items-center space-x-3 group"
                  whileHover={{ scale: 1.05, opacity: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <IconComponent className="text-4xl md:text-5xl text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors whitespace-nowrap">
                    {tech.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
