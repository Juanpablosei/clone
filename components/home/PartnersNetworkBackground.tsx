"use client";

import { useEffect, useRef } from "react";

export default function PartnersNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawPattern();
    };

    // Colores de la aplicación
    const primaryColor = "#5b7dd6"; // Primary color
    const primaryStrong = "#4a6bc4"; // Primary strong
    const primaryLight = "rgba(91, 125, 214, 0.3)"; // Primary light

    const drawPattern = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Partículas fijas
      const particles: Array<{
        x: number;
        y: number;
        radius: number;
        isHub: boolean;
      }> = [];

      const particleCount = 35;
      const hubCount = 4;
      const connectionDistance = 180;

      // Crear hubs (nodos centrales más grandes) con posiciones fijas
      const hubPositions = [
        { x: canvas.width * 0.25, y: canvas.height * 0.3 },
        { x: canvas.width * 0.5, y: canvas.height * 0.4 },
        { x: canvas.width * 0.35, y: canvas.height * 0.65 },
        { x: canvas.width * 0.75, y: canvas.height * 0.5 },
      ];

      hubPositions.forEach((pos) => {
        particles.push({
          x: pos.x,
          y: pos.y,
          radius: 10,
          isHub: true,
        });
      });

      // Crear partículas regulares con posiciones distribuidas
      const regularPositions = [
        { x: canvas.width * 0.1, y: canvas.height * 0.2 },
        { x: canvas.width * 0.4, y: canvas.height * 0.15 },
        { x: canvas.width * 0.65, y: canvas.height * 0.25 },
        { x: canvas.width * 0.15, y: canvas.height * 0.4 },
        { x: canvas.width * 0.85, y: canvas.height * 0.35 },
        { x: canvas.width * 0.3, y: canvas.height * 0.5 },
        { x: canvas.width * 0.7, y: canvas.height * 0.55 },
        { x: canvas.width * 0.1, y: canvas.height * 0.65 },
        { x: canvas.width * 0.6, y: canvas.height * 0.7 },
        { x: canvas.width * 0.85, y: canvas.height * 0.65 },
        { x: canvas.width * 0.25, y: canvas.height * 0.8 },
        { x: canvas.width * 0.55, y: canvas.height * 0.85 },
        { x: canvas.width * 0.8, y: canvas.height * 0.8 },
        { x: canvas.width * 0.45, y: canvas.height * 0.25 },
        { x: canvas.width * 0.2, y: canvas.height * 0.55 },
        { x: canvas.width * 0.9, y: canvas.height * 0.5 },
        { x: canvas.width * 0.5, y: canvas.height * 0.15 },
        { x: canvas.width * 0.35, y: canvas.height * 0.75 },
        { x: canvas.width * 0.75, y: canvas.height * 0.3 },
        { x: canvas.width * 0.15, y: canvas.height * 0.75 },
        { x: canvas.width * 0.65, y: canvas.height * 0.6 },
        { x: canvas.width * 0.4, y: canvas.height * 0.9 },
        { x: canvas.width * 0.8, y: canvas.height * 0.2 },
        { x: canvas.width * 0.3, y: canvas.height * 0.35 },
        { x: canvas.width * 0.7, y: canvas.height * 0.75 },
        { x: canvas.width * 0.55, y: canvas.height * 0.45 },
        { x: canvas.width * 0.25, y: canvas.height * 0.6 },
        { x: canvas.width * 0.9, y: canvas.height * 0.7 },
        { x: canvas.width * 0.45, y: canvas.height * 0.55 },
        { x: canvas.width * 0.6, y: canvas.height * 0.35 },
        { x: canvas.width * 0.2, y: canvas.height * 0.3 },
      ];

      regularPositions.slice(0, particleCount - hubCount).forEach((pos) => {
        particles.push({
          x: pos.x,
          y: pos.y,
          radius: 5,
          isHub: false,
        });
      });

      // Dibujar conexiones
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            // Usar colores de la aplicación
            if (particle.isHub || otherParticle.isHub) {
              ctx.strokeStyle = `rgba(91, 125, 214, ${opacity * 0.4})`;
              ctx.lineWidth = 1.5;
            } else {
              ctx.strokeStyle = `rgba(91, 125, 214, ${opacity * 0.2})`;
              ctx.lineWidth = 1;
            }
            ctx.setLineDash(particle.isHub && otherParticle.isHub ? [4, 4] : []);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });

      // Dibujar partículas
      particles.forEach((particle) => {
        if (particle.isHub) {
          // Hub más grande con color primary
          ctx.fillStyle = primaryColor;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Brillo interno
          ctx.fillStyle = primaryStrong;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Partícula regular con borde
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Borde con color primary
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // Brillo interno
          ctx.fillStyle = primaryLight;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}

