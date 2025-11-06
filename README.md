# 🚀 Raj Shekhar's Portfolio - Frontend

> Modern, AI-powered portfolio website built with React and Vite. Features real-time chat, interactive 3D elements, and seamless API integration.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://raj-shekhar-portfolio.netlify.app/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)

**🌐 Live Site:** [https://raj-shekhar-portfolio.netlify.app/](https://raj-shekhar-portfolio.netlify.app/)

---

## ⚡ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Framer Motion** | Animations |
| **React Hook Form** | Form Handling |
| **Axios** | API Requests |
| **React Hot Toast** | Notifications |
| **TailwindCSS** | Styling (if used) |
| **3D Model Viewer** | Interactive 3D Elements |

---

## ✨ Features

🎨 **Modern UI/UX**
- Smooth animations with Framer Motion
- Dark/Light theme support
- Responsive design (mobile-first)

🤖 **AI Chat Assistant**
- Real-time chat powered by backend AI
- Guided portfolio navigation
- Persistent chat history

📧 **Contact System**
- Multi-step form with validation
- File upload support
- Email confirmations via Resend

🚀 **Performance**
- Optimized build with Vite
- Lazy loading & code splitting
- Fast page loads (<2s)

---

## 📁 Project Structure 

src/
├── components/ # React components
│ ├── ui/ # Reusable UI components
│ ├── Contact.jsx # Contact form
│ ├── Projects.jsx # Projects showcase
│ └── Chat.jsx # AI chatbot
├── services/ # API integration
│ └── api.js # Axios config & endpoints
├── context/ # React Context (theme, etc.)
├── assets/ # Images, icons
└── main.jsx # App entry point


---

## 🌐 API Integration

**Backend:** Spring Boot API on Railway  
**Endpoints:** 

GET /api/projects // Portfolio projects
GET /api/skills // Technical skills
GET /api/experience // Work experience
POST /api/contact // Contact form
POST /api/chat/message // AI chat

---

## 🎨 Key Components

### **Contact Form**
- Multi-step wizard (Name/Email → Subject/Message)
- Form validation with React Hook Form & Yup
- File attachment support
- Real-time field validation

### **AI Chat**
- WebSocket connection to backend
- Streaming responses
- Chat history persistence
- Context-aware portfolio guidance

### **Projects Showcase**
- Dynamic project loading from API
- Filtering by category
- Interactive project cards
- Image galleries

---

## 🚀 Performance Optimizations

✅ Vite for fast builds & HMR  
✅ Code splitting with React.lazy  
✅ Image optimization  
✅ API response caching  
✅ Debounced search/filter  

---

## 📱 Responsive Design

- **Mobile**: Optimized touch interactions
- **Tablet**: Adaptive layouts
- **Desktop**: Full-featured experience
- **Accessibility**: ARIA labels, keyboard navigation

---


---

## 🔗 Links

- **Live Site**: [raj-shekhar-portfolio.netlify.app](https://raj-shekhar-portfolio.netlify.app/)
- **Backend Repo**: [Portfolio Backend](https://github.com/yourusername/portfolio-backend)
- **Author**: [Raj Shekhar Singh](https://github.com/yourusername)

---

**Built with ❤️ using React + Vite**  
*Deployed on Netlify*



