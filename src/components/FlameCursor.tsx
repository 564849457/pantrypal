"use client";

import {
  useEffect,
  useRef,
} from "react";

type TrailParticle = {
  x: number;
  y: number;

  vx: number;
  vy: number;

  life: number;
  maxLife: number;

  size: number;
};

export default function FlameCursor() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const cursorRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const ringRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mouseX =
    useRef(0);

  const mouseY =
    useRef(0);

  const currentX =
    useRef(0);

  const currentY =
    useRef(0);

  const ringX =
    useRef(0);

  const ringY =
    useRef(0);

  useEffect(() => {
    if (
      window.matchMedia(
        "(pointer: coarse)",
      ).matches
    ) {
      return;
    }

    const canvas =
      canvasRef.current;

    const cursorElement =
      cursorRef.current;

    const ringElement =
      ringRef.current;

    if (
      !canvas ||
      !cursorElement ||
      !ringElement
    ) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const canvasElement: HTMLCanvasElement =
      canvas;

    const ctx: CanvasRenderingContext2D =
      context;

    const cursor: HTMLDivElement =
      cursorElement;

    const ring: HTMLDivElement =
      ringElement;

    const particles: TrailParticle[] =
      [];

    let width =
      window.innerWidth;

    let height =
      window.innerHeight;

    let animationId = 0;

    let lastParticleTime = 0;

    let hasMoved =
      false;

    let hoverMode:
      | "none"
      | "interactive"
      | "recipe" =
      "none";

    // =========================================
    // Canvas resize
    // =========================================

    function resize() {
      width =
        window.innerWidth;

      height =
        window.innerHeight;

      const dpr =
        Math.min(
          window.devicePixelRatio ||
            1,
          2,
        );

      canvasElement.width =
        Math.floor(
          width * dpr,
        );

      canvasElement.height =
        Math.floor(
          height * dpr,
        );

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
    }

    // =========================================
    // Hover target detection
    // =========================================

    function detectHoverTarget(
      target: EventTarget | null,
    ) {
      if (
        !(target instanceof Element)
      ) {
        hoverMode =
          "none";

        return;
      }

      const recipeCard =
        target.closest(
          "[data-recipe-card]",
        );

      if (recipeCard) {
        hoverMode =
          "recipe";

        return;
      }

      const interactive =
        target.closest(
          "a, button, input, select, textarea, [role='button']",
        );

      if (interactive) {
        hoverMode =
          "interactive";

        return;
      }

      hoverMode =
        "none";
    }

    // =========================================
    // Pointer
    // =========================================

    function handleMove(
      event: PointerEvent,
    ) {
      mouseX.current =
        event.clientX;

      mouseY.current =
        event.clientY;

      detectHoverTarget(
        event.target,
      );

      if (!hasMoved) {
        currentX.current =
          event.clientX;

        currentY.current =
          event.clientY;

        ringX.current =
          event.clientX;

        ringY.current =
          event.clientY;

        hasMoved =
          true;
      }

      cursor.style.opacity =
        "1";

      ring.style.opacity =
        "1";
    }

    function handleLeave() {
      cursor.style.opacity =
        "0";

      ring.style.opacity =
        "0";
    }

    function handleEnter() {
      if (!hasMoved) {
        return;
      }

      cursor.style.opacity =
        "1";

      ring.style.opacity =
        "1";
    }

    // =========================================
    // Particle
    // =========================================

    function addParticle() {
      particles.push({
        x:
          currentX.current +
          (
            Math.random() -
            0.5
          ) *
            5,

        y:
          currentY.current +
          4,

        vx:
          (
            Math.random() -
            0.5
          ) *
          0.5,

        vy:
          Math.random() *
            0.35 +
          0.08,

        life:
          0,

        maxLife:
          Math.random() *
            17 +
          12,

        size:
          Math.random() *
            1.5 +
          0.45,
      });
    }

    function drawParticle(
      particle: TrailParticle,
    ) {
      const ratio =
        Math.max(
          0,
          1 -
            particle.life /
              particle.maxLife,
        );

      const radius =
        particle.size *
        ratio;

      const glowRadius =
        Math.max(
          2,
          radius * 5,
        );

      const gradient =
        ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,

          particle.x,
          particle.y,
          glowRadius,
        );

      gradient.addColorStop(
        0,
        `rgba(
          255,
          248,
          220,
          ${
            ratio *
            0.95
          }
        )`,
      );

      gradient.addColorStop(
        0.2,
        `rgba(
          255,
          175,
          65,
          ${
            ratio *
            0.75
          }
        )`,
      );

      gradient.addColorStop(
        0.65,
        `rgba(
          255,
          85,
          10,
          ${
            ratio *
            0.25
          }
        )`,
      );

      gradient.addColorStop(
        1,
        "rgba(255,70,0,0)",
      );

      ctx.beginPath();

      ctx.fillStyle =
        gradient;

      ctx.arc(
        particle.x,
        particle.y,
        glowRadius,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      ctx.beginPath();

      ctx.fillStyle =
        `rgba(
          255,
          235,
          180,
          ${ratio}
        )`;

      ctx.arc(
        particle.x,
        particle.y,
        Math.max(
          0.45,
          radius,
        ),
        0,
        Math.PI * 2,
      );

      ctx.fill();
    }

    // =========================================
    // Cursor visual state
    // =========================================

    function updateCursorAppearance() {
      if (
        hoverMode ===
        "recipe"
      ) {
        ring.style.width =
          "48px";

        ring.style.height =
          "48px";

        ring.style.borderColor =
          "rgba(251,146,60,0.62)";

        ring.style.background =
          "rgba(249,115,22,0.06)";

        ring.style.boxShadow =
          [
            "0 0 0 1px rgba(255,255,255,0.06)",
            "0 0 18px rgba(249,115,22,0.24)",
            "0 0 40px rgba(234,88,12,0.14)",
          ].join(",");

        cursor.style.setProperty(
          "--cursor-core-scale",
          "1.22",
        );

        return;
      }

      if (
        hoverMode ===
        "interactive"
      ) {
        ring.style.width =
          "36px";

        ring.style.height =
          "36px";

        ring.style.borderColor =
          "rgba(255,255,255,0.24)";

        ring.style.background =
          "rgba(255,255,255,0.035)";

        ring.style.boxShadow =
          "0 0 18px rgba(249,115,22,0.12)";

        cursor.style.setProperty(
          "--cursor-core-scale",
          "1.08",
        );

        return;
      }

      ring.style.width =
        "26px";

      ring.style.height =
        "26px";

      ring.style.borderColor =
        "rgba(255,255,255,0.12)";

      ring.style.background =
        "rgba(255,255,255,0.015)";

      ring.style.boxShadow =
        "0 0 12px rgba(249,115,22,0.07)";

      cursor.style.setProperty(
        "--cursor-core-scale",
        "1",
      );
    }

    // =========================================
    // Animation
    // =========================================

    function animate(
      time: number,
    ) {
      if (hasMoved) {
        // Core follows relatively quickly.
        currentX.current +=
          (
            mouseX.current -
            currentX.current
          ) *
          0.42;

        currentY.current +=
          (
            mouseY.current -
            currentY.current
          ) *
          0.42;

        // Ring follows slower.
        // This creates the nice floating feel.
        ringX.current +=
          (
            mouseX.current -
            ringX.current
          ) *
          0.18;

        ringY.current +=
          (
            mouseY.current -
            ringY.current
          ) *
          0.18;

        cursor.style.transform =
          `translate3d(
            ${
              currentX.current
            }px,
            ${
              currentY.current
            }px,
            0
          )`;

        ring.style.transform =
          `translate3d(
            ${
              ringX.current
            }px,
            ${
              ringY.current
            }px,
            0
          )
          translate(-50%, -50%)`;

        updateCursorAppearance();
      }

      ctx.clearRect(
        0,
        0,
        width,
        height,
      );

      // More particles when hovering recipe.
      let particleInterval =
        34;

      if (
        hoverMode ===
        "recipe"
      ) {
        particleInterval =
          20;
      } else if (
        hoverMode ===
        "interactive"
      ) {
        particleInterval =
          27;
      }

      if (
        hasMoved &&
        time -
          lastParticleTime >
          particleInterval
      ) {
        addParticle();

        if (
          hoverMode ===
            "recipe" &&
          Math.random() <
            0.38
        ) {
          addParticle();
        }

        lastParticleTime =
          time;
      }

      for (
        let i =
          particles.length -
          1;
        i >= 0;
        i -= 1
      ) {
        const particle =
          particles[i];

        particle.life +=
          1;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        particle.vx *=
          0.98;

        particle.vy +=
          0.008;

        if (
          particle.life >=
          particle.maxLife
        ) {
          particles.splice(
            i,
            1,
          );

          continue;
        }

        drawParticle(
          particle,
        );
      }

      animationId =
        requestAnimationFrame(
          animate,
        );
    }

    // =========================================
    // Start
    // =========================================

    resize();

    window.addEventListener(
      "pointermove",
      handleMove,
    );

    window.addEventListener(
      "resize",
      resize,
    );

    document.addEventListener(
      "mouseleave",
      handleLeave,
    );

    document.addEventListener(
      "mouseenter",
      handleEnter,
    );

    animationId =
      requestAnimationFrame(
        animate,
      );

    // =========================================
    // Cleanup
    // =========================================

    return () => {
      cancelAnimationFrame(
        animationId,
      );

      window.removeEventListener(
        "pointermove",
        handleMove,
      );

      window.removeEventListener(
        "resize",
        resize,
      );

      document.removeEventListener(
        "mouseleave",
        handleLeave,
      );

      document.removeEventListener(
        "mouseenter",
        handleEnter,
      );
    };
  }, []);

  return (
    <>
      {/* Particle layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9997]"
      />

      {/* Slow glass / energy ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-[26px] w-[26px] rounded-full border border-white/10 bg-white/[0.015] opacity-0 backdrop-blur-[2px] transition-[width,height,border-color,background-color,box-shadow,opacity] duration-200 md:block"
      />

      {/* Hot core */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden opacity-0 transition-opacity duration-150 md:block"
      >
        {/* Outer heat */}
        <span
          className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/15 blur-lg transition-transform duration-200"
          style={{
            transform:
              "translate(-50%, -50%) scale(var(--cursor-core-scale, 1))",
          }}
        />

        {/* Glow */}
        <span
          className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/25 blur-sm transition-transform duration-200"
          style={{
            transform:
              "translate(-50%, -50%) scale(var(--cursor-core-scale, 1))",
          }}
        />

        {/* Orange core */}
        <span
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300 shadow-[0_0_7px_rgba(251,146,60,1),0_0_16px_rgba(249,115,22,0.6),0_0_28px_rgba(234,88,12,0.28)] transition-transform duration-200"
          style={{
            transform:
              "translate(-50%, -50%) scale(var(--cursor-core-scale, 1))",
          }}
        />

        {/* White-hot center */}
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-50" />
      </div>
    </>
  );
}