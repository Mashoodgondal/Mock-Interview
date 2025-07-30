
"use client";
import { useEffect, useRef } from "react";

const AIInterviewBackground = ({ children }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        // Particle class for floating elements
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(125, 211, 252, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const createParticles = () => {
            particlesRef.current = [];
            const particleCount = Math.min(50, Math.floor((width * height) / 15000));
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(new Particle());
            }
        };

        // Draw connections between nearby particles
        const drawConnections = () => {
            const particles = particlesRef.current;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(125, 211, 252, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation loop
        const animate = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
            ctx.fillRect(0, 0, width, height);

            particlesRef.current.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawConnections();
            animationRef.current = requestAnimationFrame(animate);
        };

        // Handle mouse movement
        const handleMouseMove = (event) => {
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
        };

        // Handle resize
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            createParticles();
        };

        // Initialize
        createParticles();
        animate();

        // Event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-slate-900">
            {/* Canvas for particle animation */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
            />

            {/* Geometric shapes overlay */}
            <div className="absolute inset-0 z-10 opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 border border-sky-300 rotate-45 animate-pulse"></div>
                <div className="absolute top-1/3 right-20 w-24 h-24 border border-sky-300 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-20 h-20 border border-sky-300 animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-20 right-1/3 w-28 h-28 border border-sky-300 rotate-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 z-20 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/30"></div>
            <div className="absolute inset-0 z-30 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>

            {/* Content */}
            <div className="relative z-40 min-h-screen">
                {children}
            </div>

            {/* CSS animations for additional effects */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        .glowing {
          animation: glow 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default AIInterviewBackground;