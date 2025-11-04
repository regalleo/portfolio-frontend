import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import { useProjects } from "../../hooks/useAPI";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const Projects = () => {
  const { data: projects, isLoading } = useProjects();
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsToShow, setProjectsToShow] = useState(6);

  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const { isDarkMode } = useTheme();

  // Unique local images for each project from public folder
  const projectSpecificImages = {
    "Professional Portfolio Website": "/portfolio_pro.png",
    "Customer 360 Analytics Platform": "/customer_pro.png",
    "Task Manager Dashboard": "/task_pro.png",
    "RAG-Powered AI Knowledge Assistant": "/project-ai.jpg", // Using existing AI image since not specified
    "Credit Card Fraud Detection System": "/credit_pro.jpg",
    "Tesla Stock Data Analysis": "/tesla_pro.png",
    "Construction Management System": "/const_pro.jpg",
  };

  // Project descriptions with additional details
  const projectDescriptions = {
    "Professional Portfolio Website":
      "A modern, responsive portfolio website built with React, featuring an AI-powered chatbot using Groq API, interactive animations, and a sleek dark/light theme. Showcases professional work with dynamic content management.",
  };

  // Override live links for specific projects
  const projectLiveLinks = {
    "Customer 360 Analytics Platform": "https://customer360-brxq.onrender.com/",
    "Task Manager Dashboard":
      "https://springboot-django-full-stack-2.onrender.com/",
  };

  // Override GitHub links for specific projects
  const projectGitHubLinks = {
    "Customer 360 Analytics Platform":
      "https://github.com/regalleo/customer360-platform",
    "Task Manager Dashboard":
      "https://github.com/regalleo/springboot_django_full_stack",
    "Tesla Stock Data Analysis":
      "https://github.com/regalleo/Tesla_stock_analysis",
    "Credit Card Fraud Detection System":
      "https://github.com/regalleo/credit_card_fraud_detection",
  };

  // Project technologies with additional details
  const projectTechnologies = {
    "Professional Portfolio Website": [
      "React",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Groq AI",
      "Chatbot",
      "Three.js",
      "React Router",
      "Axios",
      "React Query",
    ],
  };

  // Get unique image for each project based on title
  const getProjectImage = (project) => {
    // Check if we have a specific image for this project title
    if (projectSpecificImages[project.title]) {
      return projectSpecificImages[project.title];
    }

    // Fallback to project.imageUrl if available, otherwise use a default
    return (
      project.imageUrl ||
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (isLoading) {
    return (
      <section
        id="projects"
        className="py-20 overflow-hidden min-h-screen"
        style={{
          backgroundImage: "url(/p2.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="text-gray-300 animate-pulse">Loading projects...</div>
        </div>
      </section>
    );
  }

  const categories = [
    "all",
    ...new Set(projects?.map((p) => p.category) || []),
  ];
  const filteredProjects =
    filter === "all"
      ? projects
      : projects?.filter((p) => p.category === filter);

  const displayedProjects = filteredProjects?.slice(0, projectsToShow) || [];

  const loadMoreProjects = () => {
    setProjectsToShow((prev) => prev + 6);
  };



  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  return (
    <section
      id="projects"
      className="relative py-32 overflow-hidden min-h-screen transition-all duration-1000"
      role="region"
      aria-labelledby="projects-title"
      style={{
        backgroundImage: "url(/p2.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-black/90 via-black/60 via-black/40 to-transparent pointer-events-none z-5" />
      <motion.div
        className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none z-4"
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SectionTitle
            title="Featured Projects"
            subtitle="Innovative solutions built with cutting-edge technologies"
            className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
          />
        </motion.div>

        {/* Filter Buttons and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 mb-16"
        >
          {/* Filter Buttons */}
          <div
            className="flex flex-wrap justify-center gap-4"
            role="tablist"
            aria-label="Project filters"
          >
            {categories.map((category, index) => (
              <motion.button
                key={`filter-category-${category}-${index}`}
                onClick={() => setFilter(category)}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  },
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  y: -3,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 },
                }}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  filter === category
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 border-cyan-400"
                    : isDarkMode
                    ? "bg-white/5 backdrop-blur-md text-gray-300 hover:bg-white/15 hover:text-white border-white/20 hover:border-cyan-400/50"
                    : "bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white hover:text-gray-900 border-gray-300/50 hover:border-blue-400/50 shadow-sm"
                }`}
                role="tab"
                aria-selected={filter === category}
                aria-controls="projects-grid"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.span>
              </motion.button>
            ))}
          </div>


        </motion.div>



        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          id="projects-grid"
          role="tabpanel"
          aria-labelledby={`filter-${filter}`}
        >
          {displayedProjects?.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                y: -15,
                scale: 1.05,
                rotateY: 5,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedProject(
                  selectedProject?._id === project._id ? null : project
                );
              }}
              className="group relative h-full cursor-pointer perspective-1000 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              style={{
                transformStyle: "preserve-3d",
              }}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${project.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedProject(
                    selectedProject?._id === project._id ? null : project
                  );
                }
              }}
            >
              {/* Premium Card */}
              <motion.div
                className="h-full bg-gradient-to-br from-black/70 via-gray-900/60 to-black/70 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/40 hover:border-cyan-500/80 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 overflow-hidden flex flex-col"
                whileHover={{
                  boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.25)",
                  borderColor: "rgba(6, 182, 212, 0.6)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Project Image - UNIQUE PER PROJECT */}
                <motion.div
                  className="relative h-48 mb-6 -mx-6 -mt-6 overflow-hidden rounded-t-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.img
                    src={getProjectImage(project)}
                    alt={project.title}
                    className={`w-full h-full ${
                      project.title === "Task Manager Dashboard"
                        ? "object-contain"
                        : "object-cover"
                    } transition-transform duration-500`}
                    onError={(e) => {
                      e.target.src =
                        projectSpecificImages.default ||
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80";
                    }}
                    whileHover={{
                      scale: 1.15,
                      transition: { duration: 0.5, ease: "easeOut" },
                    }}
                  />

                  {/* Featured Badge */}
                  {project.featured && (
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg border border-yellow-300/50 flex items-center gap-1"
                    >
                      ⭐ Featured
                    </motion.span>
                  )}

                  {/* Category Badge - NEW */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-semibold">
                    <span
                      className={`${
                        project.category === "web"
                          ? "text-blue-300"
                          : project.category === "data"
                          ? "text-green-300"
                          : project.category === "ai"
                          ? "text-purple-300"
                          : "text-cyan-300"
                      }`}
                    >
                      {project.category?.charAt(0).toUpperCase() +
                        project.category?.slice(1)}
                    </span>
                  </div>

                  {/* Project Stats Badge */}
                  {project.stats && (
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded-lg text-xs text-cyan-300 font-semibold">
                      {project.stats.eventsPerSecond ||
                        project.stats.projects ||
                        project.stats.datasetSize}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Content */}
                <h3
                  className={`text-2xl font-bold mb-3 transition-colors line-clamp-2 ${
                    isDarkMode
                      ? "text-white group-hover:text-cyan-300"
                      : "text-gray-900 group-hover:text-blue-600"
                  }`}
                >
                  {project.title}
                </h3>

                {/* Date */}
                {project.completedDate && (
                  <div
                    className={`flex items-center gap-2 mb-3 text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <FaCalendarAlt className="w-3 h-3" />
                    {formatDate(project.completedDate)}
                  </div>
                )}

                <p
                  className={`mb-6 line-clamp-3 leading-relaxed flex-grow ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {projectDescriptions[project.title] || project.description}
                </p>

                {/* Key Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: selectedProject?._id === project._id ? 1 : 0,
                      height: selectedProject?._id === project._id ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div
                      className={`text-xs space-y-1 p-3 rounded bg-cyan-500/10 border border-cyan-500/20 ${
                        isDarkMode ? "text-cyan-200" : "text-cyan-700"
                      }`}
                    >
                      {project.highlights.slice(0, 2).map((highlight, i) => (
                        <div key={`highlight-${project._id}-${i}`} className="flex gap-2">
                          <span>✓</span>
                          <span className="line-clamp-1">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Technologies */}
                <motion.div
                  className="flex flex-wrap gap-2 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {(() => {
                    const allTechs =
                      projectTechnologies[project.title] ||
                      project.technologies ||
                      [];
                    const isThisProjectExpanded = expandedProjects.has(
                      project._id
                    );
                    const techsToShow = isThisProjectExpanded
                      ? allTechs
                      : allTechs.slice(0, 3);

                    return (
                      <>
                        {/* Show technologies */}
                        {techsToShow.map((tech, techIndex) => (
                          <motion.span
                            key={`tech-${project._id}-${techIndex}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.4 + techIndex * 0.1,
                              duration: 0.3,
                              ease: "easeOut",
                            }}
                            whileHover={{
                              scale: 1.1,
                              y: -2,
                              transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-default ${
                              isDarkMode
                                ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/15 text-cyan-200 border-cyan-400/40 hover:border-cyan-400/70"
                                : "bg-gradient-to-r from-blue-100/50 to-purple-100/30 text-blue-700 border-blue-300/40 hover:border-blue-400/70"
                            }`}
                          >
                            {tech}
                          </motion.span>
                        ))}

                        {/* Show More / Show Less Button - UNIQUE KEY FOR THIS PROJECT */}
                        {allTechs.length > 3 && (
                          <motion.button
                            key={`expand-btn-${project._id}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.7,
                              duration: 0.3,
                              ease: "easeOut",
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProjectExpansion(project._id);
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                              isThisProjectExpanded
                                ? isDarkMode
                                  ? "bg-gradient-to-r from-orange-500/20 to-red-500/15 text-orange-300 border-orange-400/30 hover:bg-orange-500/30"
                                  : "bg-gradient-to-r from-orange-200/50 to-red-200/30 text-orange-600 border-orange-300/40 hover:bg-orange-300/50"
                                : isDarkMode
                                ? "bg-gradient-to-r from-gray-500/20 to-slate-500/15 text-gray-300 border-gray-400/30 hover:bg-gray-500/30"
                                : "bg-gradient-to-r from-gray-200/50 to-slate-200/30 text-gray-600 border-gray-300/40 hover:bg-gray-300/50"
                            }`}
                          >
                            {isThisProjectExpanded
                              ? "Show less"
                              : `+${allTechs.length - 3} more`}
                          </motion.button>
                        )}
                      </>
                    );
                  })()}
                </motion.div>

                {/* Links */}
                <motion.div
                  className="flex gap-4 pt-4 border-t border-cyan-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  {(projectGitHubLinks[project.title] ||
                    project.githubLink) && (
                    <motion.a
                      href={
                        projectGitHubLinks[project.title] || project.githubLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.05,
                        x: 3,
                        backgroundColor: isDarkMode
                          ? "rgba(6, 182, 212, 0.3)"
                          : "rgba(59, 130, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 group/link flex-1 justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                        isDarkMode
                          ? "bg-cyan-500/20 hover:bg-cyan-500/40 border-cyan-500/40 text-cyan-300"
                          : "bg-blue-100/50 hover:bg-blue-200/60 border-blue-300/40 text-blue-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <FaGithub className="w-4 h-4" />
                      </motion.div>
                      <span className="text-sm font-semibold">Code</span>
                    </motion.a>
                  )}
                  {(projectLiveLinks[project.title] || project.liveLink) && (
                    <motion.a
                      href={projectLiveLinks[project.title] || project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.05,
                        x: -3,
                        backgroundColor: isDarkMode
                          ? "rgba(147, 51, 234, 0.3)"
                          : "rgba(147, 51, 234, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 group/link flex-1 justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                        isDarkMode
                          ? "bg-purple-500/20 hover:bg-purple-500/40 border-purple-500/40 text-purple-300"
                          : "bg-purple-100/50 hover:bg-purple-200/60 border-purple-300/40 text-purple-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label={`View live demo of ${project.title}`}
                    >
                      <motion.div
                        whileHover={{
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </motion.div>
                      <span className="text-sm font-semibold">Live</span>
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>

              {/* Enhanced Glow effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                initial={false}
                whileHover={{
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/15 to-cyan-500/0 rounded-2xl blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 rounded-2xl" />
              </motion.div>

              {/* Floating particles effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                initial={false}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`particle-${project._id}-${i}`}
                    className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [-10, -30, -10],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                      },
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        {filteredProjects && filteredProjects.length > projectsToShow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={loadMoreProjects}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                isDarkMode
                  ? "bg-white/5 backdrop-blur-md text-gray-300 hover:bg-white/15 hover:text-white border-white/20 hover:border-cyan-400/50"
                  : "bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white hover:text-gray-900 border-gray-300/50 hover:border-blue-400/50 shadow-sm"
              }`}
            >
              <FaChevronDown className="inline mr-2" />
              Load More Projects
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProjects?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
            role="status"
            aria-live="polite"
          >
            <p
              className={`text-xl mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No projects found
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Try selecting a different filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none z-5" />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none z-4"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </section>
  );
};

export default Projects;
