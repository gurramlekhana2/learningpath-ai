import React, { useEffect, useRef } from 'react';

export const DottedSurfaceCanvas = ({
  className = '',
  interactive = true,
  opacity = 1.0,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const mouseRef = useRef({
    targetX: -2000,
    targetY: -2000,
    currentX: -2000,
    currentY: -2000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Enhanced Grid parameters from studyGraph for dense, roaming white dots
    const cols = 92;
    const rows = 60;
    const spacingX = 34;
    const spacingZ = 36;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
    };

    const handleTouchMove = (e) => {
      if (!interactive) return;
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mouseRef.current.targetX = e.touches[0].clientX - rect.left;
        mouseRef.current.targetY = e.touches[0].clientY - rect.top;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;
    const fov = 520;
    const cameraY = -220;
    const cameraZ = -80;

    const render = () => {
      if (!prefersReducedMotion) {
        time += 0.016;
      }

      // Smooth cursor lerp interpolation
      const mouse = mouseRef.current;
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.12;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.12;

      // Pure deep black background as in studyGraph
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.46; // Horizon vantage

      const mX = mouse.currentX;
      const mY = mouse.currentY;
      const mouseRadius = 240;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      // Render 3D roaming white balls matrix
      for (let r = 0; r < rows; r++) {
        const zPos = 140 + r * spacingZ - cameraZ;
        const zFactor = fov / (fov + zPos);

        const progressZ = r / rows;
        const baseAlpha = Math.max(0.18, Math.min(1.0, 1.05 - progressZ * 0.62)) * opacity;

        for (let c = 0; c < cols; c++) {
          const xPos = (c - cols / 2) * spacingX;

          // Harmonic sinusoidal wave movements
          const wave1 = Math.sin(c * 0.14 + time * 1.7) * Math.cos(r * 0.12 + time * 1.2) * 54;
          const wave2 = Math.sin((c + r) * 0.08 - time * 1.4) * 30;
          const wave3 = Math.cos(c * 0.06 + r * 0.05 + time * 0.85) * 18;
          const yPos = cameraY + wave1 + wave2 + wave3;

          // 3D to 2D projection
          let screenX = centerX + xPos * zFactor;
          let screenY = centerY - yPos * zFactor;

          let radius = Math.max(0.9, Math.min(3.6, 3.4 * zFactor));
          let alpha = baseAlpha;

          // Interactive cursor ripple & repulsive displacement
          const dx = screenX - mX;
          const dy = screenY - mY;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const proximity = 1 - dist / mouseRadius;
            const smoothProximity = proximity * proximity * (3 - 2 * proximity);

            const ripple = Math.sin(dist * 0.07 - time * 5) * smoothProximity * 28;
            const pushAngle = Math.atan2(dy, dx);
            const pushDist = smoothProximity * 22;

            screenX += Math.cos(pushAngle) * pushDist;
            screenY += Math.sin(pushAngle) * pushDist + ripple;

            alpha = Math.min(1.0, alpha + smoothProximity * 0.45);
            radius += smoothProximity * 1.4;
          }

          if (screenX >= -12 && screenX <= width + 12 && screenY >= -12 && screenY <= height + 12) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 245, 250, ${alpha.toFixed(3)})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive, opacity]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden bg-[#080808] ${className}`}
      style={{ zIndex: 0 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Subtle atmospheric vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/85 via-transparent to-[#080808]" />
    </div>
  );
};
