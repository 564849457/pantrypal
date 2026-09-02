"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;

  baseX: number;

  radius: number;
  baseRadius: number;

  speedY: number;
  driftX: number;

  alpha: number;
  depth: number;

  waveAmp: number;
  waveFreq: number;
  waveOffset: number;

  pulseSpeed: number;
  pulseOffset: number;

  tail: number;
};

export default function SparkCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const canvasElement: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let time = 0;

    const PARTICLE_COUNT = 90;

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function createParticle(
      initial = true,
    ): Particle {
      const depth = random(0.45, 2.1);

      const baseRadius =
        random(1, 4.8) * depth;

      return {
        x: random(0, width),

        y: initial
          ? random(-height * 0.3, height)
          : random(-140, -20),

        baseX: random(0, width),

        radius: baseRadius,
        baseRadius,

        speedY:
          random(0.35, 1.65) * depth,

        driftX:
          random(-0.4, 0.4) * depth,

        alpha:
          random(0.18, 0.92),

        depth,

        waveAmp:
          random(8, 45) * depth,

        waveFreq:
          random(0.003, 0.015),

        waveOffset:
          random(0, Math.PI * 2),

        pulseSpeed:
          random(0.012, 0.045),

        pulseOffset:
          random(0, Math.PI * 2),

        tail:
          random(6, 28) * depth,
      };
    }

    function resetParticle(
      particle: Particle,
    ) {
      const next =
        createParticle(false);

      particle.x = next.x;
      particle.y = next.y;

      particle.baseX =
        next.baseX;

      particle.radius =
        next.radius;

      particle.baseRadius =
        next.baseRadius;

      particle.speedY =
        next.speedY;

      particle.driftX =
        next.driftX;

      particle.alpha =
        next.alpha;

      particle.depth =
        next.depth;

      particle.waveAmp =
        next.waveAmp;

      particle.waveFreq =
        next.waveFreq;

      particle.waveOffset =
        next.waveOffset;

      particle.pulseSpeed =
        next.pulseSpeed;

      particle.pulseOffset =
        next.pulseOffset;

      particle.tail =
        next.tail;
    }

    function resize() {
      const parent =
        canvasElement.parentElement;

      width =
        parent?.clientWidth ??
        window.innerWidth;

      height =
        parent?.clientHeight ??
        700;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      canvasElement.width =
        Math.floor(width * dpr);

      canvasElement.height =
        Math.floor(height * dpr);

      canvasElement.style.width =
        `${width}px`;

      canvasElement.style.height =
        `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );

      particles = Array.from(
        {
          length: PARTICLE_COUNT,
        },
        () => createParticle(true),
      );
    }

    function drawBackgroundGlow() {
      const gradient =
        ctx.createRadialGradient(
          width * 0.72,
          height * 0.16,
          20,

          width * 0.72,
          height * 0.16,

          Math.max(
            width,
            height,
          ) * 0.7,
        );

      gradient.addColorStop(
        0,
        "rgba(255, 145, 45, 0.18)",
      );

      gradient.addColorStop(
        0.25,
        "rgba(255, 90, 20, 0.10)",
      );

      gradient.addColorStop(
        0.6,
        "rgba(140, 40, 5, 0.04)",
      );

      gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)",
      );

      ctx.fillStyle =
        gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height,
      );
    }

    function drawParticle(
      particle: Particle,
    ) {
      const pulse =
        1 +
        Math.sin(
          time *
            particle.pulseSpeed +
            particle.pulseOffset,
        ) *
          0.4;

      const depthPulse =
        1 +
        Math.sin(
          time *
            0.006 *
            particle.depth +
            particle.waveOffset,
        ) *
          0.15;

      const currentRadius =
        particle.baseRadius *
        pulse *
        depthPulse;

      const glowRadius =
        currentRadius * 3.5;

      const tailLength =
        particle.tail *
        (0.8 + particle.depth * 0.25);

      // ---------------------------
      // Tail
      // ---------------------------

      const tailGradient =
        ctx.createLinearGradient(
          particle.x,
          particle.y - tailLength,
          particle.x,
          particle.y,
        );

      tailGradient.addColorStop(
        0,
        "rgba(255, 150, 60, 0)",
      );

      tailGradient.addColorStop(
        1,
        `rgba(255, 135, 45,${
          0.2 *
          particle.alpha
        })`,
      );

      ctx.beginPath();

      ctx.strokeStyle =
        tailGradient;

      ctx.lineWidth =
        Math.max(
          0.7,
          currentRadius * 0.6,
        );

      ctx.moveTo(
        particle.x,
        particle.y - tailLength,
      );

      ctx.lineTo(
        particle.x,
        particle.y,
      );

      ctx.stroke();

      // ---------------------------
      // Outer glow
      // ---------------------------

      const glow =
        ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,

          particle.x,
          particle.y,

          glowRadius,
        );

      glow.addColorStop(
        0,
        `rgba(255, 245, 205,${
          0.9 *
          particle.alpha
        })`,
      );

      glow.addColorStop(
        0.22,
        `rgba(255, 185, 80,${
          0.55 *
          particle.alpha
        })`,
      );

      glow.addColorStop(
        0.6,
        `rgba(255, 100, 20,${
          0.16 *
          particle.alpha
        })`,
      );

      glow.addColorStop(
        1,
        "rgba(255, 70, 10, 0)",
      );

      ctx.beginPath();

      ctx.fillStyle =
        glow;

      ctx.arc(
        particle.x,
        particle.y,
        glowRadius,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      // ---------------------------
      // Core
      // ---------------------------

      ctx.beginPath();

      ctx.fillStyle =
        `rgba(255, 240, 195,${particle.alpha})`;

      ctx.arc(
        particle.x,
        particle.y,
        Math.max(
          0.6,
          currentRadius,
        ),
        0,
        Math.PI * 2,
      );

      ctx.fill();
    }

    function updateParticle(
      particle: Particle,
    ) {
      particle.y +=
        particle.speedY;

      const sway =
        Math.sin(
          time *
            particle.waveFreq +
            particle.waveOffset,
        ) *
        particle.waveAmp;

      const secondaryWave =
        Math.cos(
          time *
            particle.waveFreq *
            0.45 +
            particle.pulseOffset,
        ) *
        particle.waveAmp *
        0.2;

      particle.baseX +=
        particle.driftX;

      particle.x =
        particle.baseX +
        sway +
        secondaryWave;

      if (
        particle.baseX < -100
      ) {
        particle.baseX =
          width + 100;
      }

      if (
        particle.baseX >
        width + 100
      ) {
        particle.baseX =
          -100;
      }

      if (
        particle.y >
        height + 60
      ) {
        resetParticle(
          particle,
        );
      }
    }

    function render() {
      time += 1;

      ctx.clearRect(
        0,
        0,
        width,
        height,
      );

      drawBackgroundGlow();

      for (
        const particle
        of particles
      ) {
        updateParticle(
          particle,
        );

        drawParticle(
          particle,
        );
      }

      animationId =
        window.requestAnimationFrame(
          render,
        );
    }

    function handleResize() {
      resize();
    }

    resize();
    render();

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.cancelAnimationFrame(
        animationId,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}