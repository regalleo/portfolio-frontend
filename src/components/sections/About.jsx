import React, { Suspense, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import { useAbout } from "../../hooks/useAPI";
import { useTheme } from "../../context/ThemeContext";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaDownload,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import toast from 'react-hot-toast';

const Model = ({ url }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.01,
      10000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0.1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 0.8);
    pointLight1.position.set(-15, 5, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 0.6);
    pointLight2.position.set(15, -5, 10);
    scene.add(pointLight2);

    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.6);
    scene.add(hemisphereLight);

    // Load textures with error handling
    const textureLoader = new THREE.TextureLoader();
    let diffuseTexture, normalTexture, roughnessTexture, metallicTexture, pbrTexture, tableFlipTexture, shadedTexture;

    try {
      diffuseTexture = textureLoader.load('/texture_diffuse.png');
      normalTexture = textureLoader.load('/texture_normal.png');
      roughnessTexture = textureLoader.load('/texture_roughness.png');
      metallicTexture = textureLoader.load('/texture_metallic.png');
      pbrTexture = textureLoader.load('/texture_pbr.png');
      tableFlipTexture = textureLoader.load('/table flip.png');
      shadedTexture = textureLoader.load('/shaded.png');

      // Set proper encoding for color textures
      diffuseTexture.encoding = THREE.sRGBColorSpace;
      pbrTexture.encoding = THREE.sRGBColorSpace;
      tableFlipTexture.encoding = THREE.sRGBColorSpace;
      shadedTexture.encoding = THREE.sRGBColorSpace;
    } catch (err) {
      console.warn('Texture loading error:', err);
    }

    // Load OBJ model
    const objLoader = new OBJLoader();
    objLoader.load(
      url,
      (object) => {
        console.log('Model loaded successfully');
        console.log('Model bounds:', new THREE.Box3().setFromObject(object));

        // Apply material and calculate bounds
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        console.log('Model size:', size);
        console.log('Model center:', center);

        // Center the model
        object.position.sub(center);

        // Auto-scale model to fit view
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Add padding
        camera.position.z = cameraZ;

        // Apply PBR material with all available textures
        object.traverse((child) => {
          if (child.isMesh) {
            if (diffuseTexture && normalTexture && roughnessTexture && metallicTexture) {
              child.material = new THREE.MeshStandardMaterial({
                map: diffuseTexture,
                normalMap: normalTexture,
                roughnessMap: roughnessTexture,
                metalnessMap: metallicTexture,
                metalness: 0.5,
                roughness: 0.6,
                envMapIntensity: 1.2,
              });

              // Add additional texture maps if available
              if (pbrTexture) {
                child.material.aoMap = pbrTexture;
                child.material.aoMapIntensity = 0.8;
              }
              if (tableFlipTexture) {
                child.material.emissiveMap = tableFlipTexture;
                child.material.emissive = new THREE.Color(0x222222);
              }
              if (shadedTexture) {
                // Use shaded texture as additional diffuse or ambient occlusion
                child.material.lightMap = shadedTexture;
                child.material.lightMapIntensity = 0.5;
              }
            } else {
              // Fallback material
              child.material = new THREE.MeshPhongMaterial({
                color: 0xcccccc,
                shininess: 100,
              });
            }
            child.material.side = THREE.DoubleSide;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(object);

        // Animation loop with rotation controls
        let animationId;
        let rotationX = 0;
        let rotationY = 0;

        const animate = () => {
          animationId = requestAnimationFrame(animate);

          // Smooth rotation
          object.rotation.x += (rotationX - object.rotation.x) * 0.05;
          object.rotation.y += (rotationY - object.rotation.y) * 0.05;

          // Auto-rotate if not being controlled
          rotationY += 0.003;

          renderer.render(scene, camera);
        };
        animate();

        // Mouse control for rotation
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        renderer.domElement.addEventListener('mousedown', (e) => {
          isDragging = true;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        renderer.domElement.addEventListener('mousemove', (e) => {
          if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            rotationX += deltaY * 0.01;
            rotationY += deltaX * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
          }
        });

        renderer.domElement.addEventListener('mouseup', () => {
          isDragging = false;
        });

        return () => cancelAnimationFrame(animationId);
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [url]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '700px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'transparent',
        cursor: 'grab',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          fontSize: '12px',
          color: '#00ffff',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

const About = () => {
  const { data: about, isLoading } = useAbout();
  const { isDarkMode } = useTheme();
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (isLoading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="loader mx-auto"></div>
        </div>
      </section>
    );
  }

  const stats = [
    { label: "Internships Completed", value: "2+", emoji: "💼" },
    { label: "Full-Stack & Big Data projects", value: "10+", emoji: "🧩" },
    { label: "REST APIs Designed", value: "25+", emoji: "🔌" },
    { label: "ML/IoT Models for Agriculture", value: "Built", emoji: "📈" },
    { label: "Coding Exercises Across Platforms", value: "450+", emoji: "💻" },
    { label: "Real-World DB Scenarios Solved", value: "300+", emoji: "🔍" },
  ];

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

  return (
    <section id="about" className={`relative py-20 overflow-hidden ${
      isDarkMode ? 'bg-transparent' : 'bg-white'
    }`}>
      {/* Premium Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            key={`about-sparkle-${i}`}
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
          title="About Me"
          subtitle="Get to know more about who I am and what I do"
          className={isDarkMode ? "text-white" : "text-gray-900"}
        />

        <div className="grid md:grid-cols-2 gap-12 items-center">
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
          >
            <div className="relative space-y-4">
              <motion.img
                src="/about_1.png"
                alt="About 1"
                className="w-85 h-auto object-cover rounded-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              />
              <motion.img
                src="/hi_2.png"
                alt="Profile Photo"
                className="w-66 h-66 mx-auto rounded-2xl object-cover"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>

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
            className="space-y-6"
          >
            <h3 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {about?.name || "Raj Shekhar Singh"}
            </h3>
            <p className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-cyan-400' : 'text-blue-600'
            }`}>
              {about?.title || "Software Developer & Data Engineer"}
            </p>
            <motion.div
              className="bg-gradient-to-br from-white/10 via-cyan-500/5 to-purple-500/5 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-cyan-400/30 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {(() => {
                  const bio = about?.bio || "Passionate about technology and innovation, I specialize in building scalable applications and solving complex problems.";
                  const sentences = bio.split('. ').filter(s => s.trim());

                  return sentences.map((sentence, index) => {
                    if (sentence.includes('B.Tech EEE graduate')) {
                      return (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border-l-4 border-cyan-400 hover:border-cyan-300 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <span className="text-3xl">🎓</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-cyan-300 font-bold text-lg mb-2">Education & Background</h4>
                              <p className="text-gray-300 leading-relaxed">
                                <span className="text-cyan-400 font-medium">{sentence}</span>.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    } else if (sentence.includes('architect real-time data pipelines')) {
                      return (
                        <motion.div
                            key={index}
                          className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-5 border-l-4 border-purple-400 hover:border-purple-300 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <span className="text-3xl">⚡</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-purple-300 font-bold text-lg mb-2">Engineering Expertise</h4>
                              <p className="text-gray-300 leading-relaxed">
                                <span className="text-purple-400 font-medium">{sentence}</span>.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    } else if (sentence.includes('build lightning-fast React applications')) {
                      return (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-5 border-l-4 border-pink-400 hover:border-pink-300 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <span className="text-3xl">🚀</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-pink-300 font-bold text-lg mb-2">Full-Stack Development</h4>
                              <p className="text-gray-300 leading-relaxed">
                                <span className="text-pink-400 font-medium">{sentence}</span>.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    } else if (sentence.includes('deploy Gen-AI solutions')) {
                      return (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-5 border-l-4 border-green-400 hover:border-green-300 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <span className="text-3xl">🤖</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-green-300 font-bold text-lg mb-2">AI & Gen-AI Solutions</h4>
                              <p className="text-gray-300 leading-relaxed">
                                <span className="text-green-400 font-medium">{sentence}</span>.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    } else if (sentence.includes('From microservices optimization')) {
                      return (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-5 border-l-4 border-cyan-400 hover:border-cyan-300 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <span className="text-3xl">⚡</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-cyan-300 font-bold text-lg mb-2">Technical Innovation & Impact</h4>
                              <p className="text-gray-300 leading-relaxed">
                                <span className="text-cyan-400 font-medium">{sentence}</span>.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 bg-white/5 rounded-lg p-4 border border-cyan-400/10"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-cyan-400 text-2xl mt-1">▹</span>
                        <p className="text-gray-300 leading-relaxed">
                          {sentence}.
                        </p>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </motion.div>



            {/* Enhanced Connect With Me Section */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <h4 className={`text-3xl font-black mb-8 flex items-center justify-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-3 ${
                  isDarkMode ? 'bg-cyan-400' : 'bg-blue-500'
                }`}></span>
                Social's
                <span className={`w-2 h-2 rounded-full ml-3 ${
                  isDarkMode ? 'bg-pink-400' : 'bg-purple-500'
                }`}></span>
              </h4>

              {/* Social Icons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {/* Email */}
                {about?.email && (
                  <motion.button
                    onClick={() => copyToClipboard(about.email)}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-2xl group-hover:shadow-red-500/50 transition-all duration-300">
                        <motion.div
                          animate={copiedEmail ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {copiedEmail ? (
                            <FaCheck className="text-3xl text-white" />
                          ) : (
                            <FaEnvelope className="text-3xl text-white" />
                          )}
                        </motion.div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center">
                      {copiedEmail ? 'Copied!' : 'Email'}
                    </span>
                  </motion.button>
                )}

                {/* Phone */}
                {about?.phone && (
                  <motion.a
                    href={`tel:${about.phone}`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300">
                        <FaPhone className="text-3xl text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center">Call</span>
                  </motion.a>
                )}

                {/* GitHub */}
                {about?.githubUrl && (
                  <motion.a
                    href={about.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-2xl shadow-2xl group-hover:shadow-gray-500/50 transition-all duration-300">
                        <FaGithub className="text-3xl text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center">GitHub</span>
                  </motion.a>
                )}

                {/* LinkedIn */}
                {about?.linkedinUrl && (
                  <motion.a
                    href={about.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300">
                        <FaLinkedin className="text-3xl text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center">LinkedIn</span>
                  </motion.a>
                )}
              </div>

              {/* Location & Resume Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Location Card */}
                <motion.div
                  className="bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent rounded-2xl p-8 border border-pink-400/30 backdrop-blur-sm hover:border-pink-400/60 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-pink-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all"></div>
                      <div className="relative bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-xl">
                        <FaMapMarkerAlt className="text-2xl text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-white mb-1">Location</h5>
                      <p className="text-gray-300">{about?.location || "Bangalore, India"}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Download Resume Card */}
                <motion.a
                  href={about?.resumeUrl || "/resume.pdf"}
                  download="Raj_Shekhar_Singh_Resume.pdf"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-400/30 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300 h-full flex items-center justify-center cursor-pointer hover:bg-gradient-to-r hover:from-cyan-500/30 hover:via-blue-500/20 hover:to-purple-500/20">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-all"></div>
                        <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                          <FaDownload className="text-2xl text-white" />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-lg font-bold text-white mb-1">Download Resume</h5>
                        <p className="text-sm text-gray-300">Get my full profile</p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              </div>
            </motion.div>

          </motion.div>

          <div className="space-y-6">
            {about?.tagline && (
              <motion.div
                className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-4 mb-6 border-l-4 border-cyan-400"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-cyan-300 font-medium italic">
                  "{about.tagline}"
                </p>
              </motion.div>
            )}

            {about?.expertise && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className={`text-xl font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-3 ${
                    isDarkMode ? 'bg-cyan-400' : 'bg-blue-500'
                  }`}></span>
                  Expertise
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {about.expertise.split('•').map((skill, index) => skill.trim() && (
                    <div key={`about-expertise-${index}-${skill.slice(0, 10)}`} className="flex items-center space-x-2 text-gray-300">
                      <span className="text-cyan-400">▹</span>
                      <span>{skill.trim()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {about?.currentFocus && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-3 ${
                    isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                  }`}></span>
                  Current Focus
                </h4>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-400/20">
                  <p className="text-gray-300 leading-relaxed">
                    {about.currentFocus}
                  </p>
                </div>
              </motion.div>
            )}

            {about?.availability && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-3 ${
                    isDarkMode ? 'bg-green-400' : 'bg-green-500'
                  }`}></span>
                  Availability
                </h4>
                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-4 border border-green-400/20">
                  <p className="text-cyan-300 leading-relaxed font-medium">
                    {about.availability}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut"
                }
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <Card
                delay={0}
                className="bg-white/10 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300"
              >
              <div className="text-center">
                <motion.div
                  className="text-4xl mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.emoji}
                </motion.div>
                <motion.div
                  className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-300 font-medium text-sm">{stat.label}</div>
              </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
