"use client";

import { useRouter } from "next/navigation";
import type {
  MouseEvent,
  ReactNode,
} from "react";
import { useRef } from "react";

type BurnRecipeLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  duration?: number;
};

type Particle = {
  x: number;
  y: number;

  vx: number;
  vy: number;

  size: number;

  life: number;
  maxLife: number;

  alpha: number;
  glow: number;

  type: "fire" | "ember" | "ash";
};

function random(
  min: number,
  max: number,
) {
  return (
    Math.random() *
      (max - min) +
    min
  );
}

/* =========================================================
   Irregular burn front
========================================================= */

function getBurnFrontY(
  x: number,
  width: number,
  height: number,
  progress: number,
) {
  /*
   * Base burn travels upward
   *
   * progress 0 -> bottom
   * progress 1 -> above top
   */

  const base =
    height -
    progress *
      (height + 90);

  /*
   * Combine multiple waves.
   * This is what makes the burn edge uneven.
   */

  const wave1 =
    Math.sin(
      x * 0.025 +
        progress * 8,
    ) * 18;

  const wave2 =
    Math.sin(
      x * 0.067 -
        progress * 11,
    ) * 10;

  const wave3 =
    Math.sin(
      x * 0.135 +
        progress * 17,
    ) * 5;

  /*
   * Larger-scale hills
   */

  const hill =
    Math.sin(
      (x / width) *
        Math.PI *
        3.4 +
        1.2,
    ) * 13;

  return (
    base +
    wave1 +
    wave2 +
    wave3 +
    hill
  );
}

/* =========================================================
   Dynamic clip path
========================================================= */

function buildBurnClipPath(
  width: number,
  height: number,
  progress: number,
) {
  /*
   * Keep everything ABOVE the burn front.
   * Everything below disappears completely.
   */

  const points: string[] = [];

  points.push("0px 0px");
  points.push(
    `${width}px 0px`,
  );

  /*
   * Build right -> left along irregular burn edge
   */

  const segments = 28;

  for (
    let i = segments;
    i >= 0;
    i -= 1
  ) {
    const x =
      (i / segments) *
      width;

    const y =
      getBurnFrontY(
        x,
        width,
        height,
        progress,
      );

    points.push(
      `${x}px ${Math.max(-80, Math.min(height + 20, y))}px`,
    );
  }

  return `polygon(${points.join(
    ", ",
  )})`;
}

/* =========================================================
   Burn
========================================================= */

function startBurnAnimation(
  card: HTMLElement,
  clickX: number,
  clickY: number,
  duration: number,
  onComplete: () => void,
) {
  if (
    card.dataset.burning ===
    "true"
  ) {
    return;
  }

  card.dataset.burning =
    "true";

  const rect =
    card.getBoundingClientRect();

  const width =
    rect.width;

  const height =
    rect.height;

  /*
   * Important:
   * FX canvas is NOT inside the card.
   *
   * Otherwise clip-path would cut the particles as well.
   */

  const fx =
    document.createElement(
      "div",
    );

  fx.className =
    "recipe-burn-fx";

  fx.style.position =
    "fixed";

  fx.style.left =
    `${rect.left}px`;

  fx.style.top =
    `${rect.top}px`;

  fx.style.width =
    `${width}px`;

  fx.style.height =
    `${height}px`;

  fx.style.zIndex =
    "9998";

  fx.style.pointerEvents =
    "none";

  fx.style.overflow =
    "visible";

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.className =
    "recipe-burn-canvas";

  fx.appendChild(canvas);

  document.body.appendChild(
    fx,
  );

  const context =
    canvas.getContext("2d");

  if (!context) {
    fx.remove();

    delete card.dataset
      .burning;

    onComplete();

    return;
  }

  const ctx: CanvasRenderingContext2D =
    context;

  const dpr =
    Math.min(
      window.devicePixelRatio ||
        1,
      2,
    );

  /*
   * Extra space above card so flying sparks
   * don't get clipped.
   */

  const extraTop = 100;
  const extraSide = 40;

  fx.style.left =
    `${
      rect.left -
      extraSide
    }px`;

  fx.style.top =
    `${
      rect.top -
      extraTop
    }px`;

  fx.style.width =
    `${
      width +
      extraSide * 2
    }px`;

  fx.style.height =
    `${
      height +
      extraTop +
      30
    }px`;

  const canvasWidth =
    width +
    extraSide * 2;

  const canvasHeight =
    height +
    extraTop +
    30;

  canvas.width =
    Math.floor(
      canvasWidth * dpr,
    );

  canvas.height =
    Math.floor(
      canvasHeight * dpr,
    );

  canvas.style.width =
    `${canvasWidth}px`;

  canvas.style.height =
    `${canvasHeight}px`;

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0,
  );

  /*
   * Coordinate offsets:
   * card coordinates -> FX canvas coordinates
   */

  const offsetX =
    extraSide;

  const offsetY =
    extraTop;

  const particles: Particle[] =
    [];

  let animationId = 0;

  const startTime =
    performance.now();

  /* =======================================================
     Particle creation
  ======================================================== */

  function addParticle(
    x: number,
    y: number,
    type:
      | "fire"
      | "ember"
      | "ash" =
      "ember",
  ) {
    if (
      type === "fire"
    ) {
      particles.push({
        x:
          x +
          offsetX,

        y:
          y +
          offsetY,

        vx: random(
          -0.9,
          0.9,
        ),

        vy: random(
          -4.8,
          -1.9,
        ),

        size: random(
          2.2,
          5.5,
        ),

        life: 0,

        maxLife: random(
          18,
          34,
        ),

        alpha: random(
          0.7,
          1,
        ),

        glow: random(
          12,
          26,
        ),

        type,
      });

      return;
    }

    if (
      type === "ash"
    ) {
      particles.push({
        x:
          x +
          offsetX,

        y:
          y +
          offsetY,

        vx: random(
          -1.5,
          1.5,
        ),

        vy: random(
          -2.3,
          -0.4,
        ),

        size: random(
          1,
          3.2,
        ),

        life: 0,

        maxLife: random(
          35,
          75,
        ),

        alpha: random(
          0.3,
          0.7,
        ),

        glow: 0,

        type,
      });

      return;
    }

    particles.push({
      x:
        x +
        offsetX,

      y:
        y +
        offsetY,

      vx: random(
        -1.8,
        1.8,
      ),

      vy: random(
        -5,
        -1.2,
      ),

      size: random(
        1.1,
        3.5,
      ),

      life: 0,

      maxLife: random(
        25,
        55,
      ),

      alpha: random(
        0.5,
        1,
      ),

      glow: random(
        8,
        18,
      ),

      type,
    });
  }

  /* =======================================================
     Initial click explosion
  ======================================================== */

  function initialBurst() {
    const localX =
      clickX -
      rect.left;

    const localY =
      clickY -
      rect.top;

    for (
      let i = 0;
      i < 30;
      i += 1
    ) {
      addParticle(
        localX +
          random(
            -15,
            15,
          ),

        localY +
          random(
            -15,
            15,
          ),

        "ember",
      );
    }
  }

  /* =======================================================
     Draw particle
  ======================================================== */

  function drawParticle(
    particle: Particle,
  ) {
    const ratio =
      Math.max(
        0,
        1 -
          particle.life /
            particle.maxLife,
      );

    if (
      particle.type ===
      "ash"
    ) {
      ctx.beginPath();

      ctx.fillStyle =
        `rgba(
          70,
          55,
          48,
          ${
            particle.alpha *
            ratio
          }
        )`;

      ctx.arc(
        particle.x,
        particle.y,
        Math.max(
          0.5,
          particle.size *
            ratio,
        ),
        0,
        Math.PI * 2,
      );

      ctx.fill();

      return;
    }

    const radius =
      particle.size *
      ratio;

    const glowRadius =
      radius +
      particle.glow *
        ratio;

    const gradient =
      ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,

        particle.x,
        particle.y,
        glowRadius,
      );

    if (
      particle.type ===
      "fire"
    ) {
      gradient.addColorStop(
        0,
        `rgba(
          255,
          255,
          220,
          ${
            particle.alpha *
            ratio
          }
        )`,
      );

      gradient.addColorStop(
        0.2,
        `rgba(
          255,
          210,
          90,
          ${
            0.9 *
            particle.alpha *
            ratio
          }
        )`,
      );

      gradient.addColorStop(
        0.55,
        `rgba(
          255,
          85,
          10,
          ${
            0.45 *
            ratio
          }
        )`,
      );
    } else {
      gradient.addColorStop(
        0,
        `rgba(
          255,
          235,
          170,
          ${
            particle.alpha *
            ratio
          }
        )`,
      );

      gradient.addColorStop(
        0.3,
        `rgba(
          255,
          145,
          40,
          ${
            0.72 *
            ratio
          }
        )`,
      );

      gradient.addColorStop(
        0.7,
        `rgba(
          255,
          60,
          5,
          ${
            0.22 *
            ratio
          }
        )`,
      );
    }

    gradient.addColorStop(
      1,
      "rgba(255,60,0,0)",
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
        225,
        150,
        ${
          particle.alpha *
          ratio
        }
      )`;

    ctx.arc(
      particle.x,
      particle.y,
      Math.max(
        0.5,
        radius,
      ),
      0,
      Math.PI * 2,
    );

    ctx.fill();
  }

  /* =======================================================
     Physics
  ======================================================== */

  function updateParticle(
    particle: Particle,
  ) {
    particle.life += 1;

    particle.x +=
      particle.vx;

    particle.y +=
      particle.vy;

    /*
     * Fire floats upward.
     * Ash falls/slows differently.
     */

    if (
      particle.type ===
      "ash"
    ) {
      particle.vy +=
        0.015;

      particle.vx +=
        Math.sin(
          particle.life *
            0.15,
        ) *
        0.015;
    } else {
      particle.vy -=
        0.006;

      particle.vx +=
        Math.sin(
          particle.life *
            0.22,
        ) *
        0.018;
    }

    particle.vx *=
      0.994;
  }

  /* =======================================================
     Burn edge
  ======================================================== */

  function drawBurnEdge(
    progress: number,
  ) {
    ctx.save();

    /*
     * Draw many small glowing segments
     * following the exact irregular front.
     */

    for (
      let x = 0;
      x < width;
      x += 4
    ) {
      const y =
        getBurnFrontY(
          x,
          width,
          height,
          progress,
        );

      if (
        y < -30 ||
        y >
          height + 30
      ) {
        continue;
      }

      const nextY =
        getBurnFrontY(
          x + 4,
          width,
          height,
          progress,
        );

      const gradient =
        ctx.createRadialGradient(
          x +
            offsetX,
          y +
            offsetY,
          0,

          x +
            offsetX,
          y +
            offsetY,
          16,
        );

      gradient.addColorStop(
        0,
        "rgba(255,235,150,0.85)",
      );

      gradient.addColorStop(
        0.2,
        "rgba(255,140,35,0.62)",
      );

      gradient.addColorStop(
        0.6,
        "rgba(255,55,5,0.22)",
      );

      gradient.addColorStop(
        1,
        "rgba(255,40,0,0)",
      );

      ctx.strokeStyle =
        gradient;

      ctx.lineWidth =
        random(
          2,
          5,
        );

      ctx.beginPath();

      ctx.moveTo(
        x +
          offsetX,
        y +
          offsetY,
      );

      ctx.lineTo(
        x +
          4 +
          offsetX,
        nextY +
          offsetY,
      );

      ctx.stroke();
    }

    ctx.restore();
  }

  /* =======================================================
     Main loop
  ======================================================== */

  function frame(
    now: number,
  ) {
    const elapsed =
      now -
      startTime;

    const progress =
      Math.min(
        elapsed /
          duration,
        1,
      );

    ctx.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight,
    );

    /*
     * THIS is what removes the burned part.
     *
     * No blur.
     * No fake dark overlay.
     *
     * The card itself gets clipped.
     */

    card.style.clipPath =
      buildBurnClipPath(
        width,
        height,
        progress,
      );

    card.style.setProperty(
      "-webkit-clip-path",
      buildBurnClipPath(
        width,
        height,
        progress,
      ),
    );

    /* ------------------------------------------
       Draw irregular glowing burn edge
    ------------------------------------------- */

    drawBurnEdge(
      progress,
    );

    /* ------------------------------------------
       Emit particles from random X positions
    ------------------------------------------- */

    const emissionCount =
      progress <
      0.8
        ? 14
        : 8;

    for (
      let i = 0;
      i <
      emissionCount;
      i += 1
    ) {
      const x =
        random(
          0,
          width,
        );

      const y =
        getBurnFrontY(
          x,
          width,
          height,
          progress,
        );

      if (
        y >= -25 &&
        y <=
          height + 25
      ) {
        const chance =
          Math.random();

        if (
          chance <
          0.25
        ) {
          addParticle(
            x,
            y,
            "fire",
          );
        } else if (
          chance <
          0.82
        ) {
          addParticle(
            x,
            y,
            "ember",
          );
        } else {
          addParticle(
            x,
            y,
            "ash",
          );
        }
      }
    }

    /* ------------------------------------------
       Particle render
    ------------------------------------------- */

    for (
      let i =
        particles.length -
        1;
      i >= 0;
      i -= 1
    ) {
      const particle =
        particles[i];

      updateParticle(
        particle,
      );

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

    if (
      progress < 1
    ) {
      animationId =
        requestAnimationFrame(
          frame,
        );

      return;
    }

    /*
     * Completely remove card visually.
     */

    card.style.visibility =
      "hidden";
  }

  initialBurst();

  animationId =
    requestAnimationFrame(
      frame,
    );

  /* =======================================================
     Navigate
  ======================================================== */

  window.setTimeout(
    () => {
      onComplete();
    },

    duration + 50,
  );

  /* =======================================================
     Cleanup
  ======================================================== */

  window.setTimeout(
    () => {
      cancelAnimationFrame(
        animationId,
      );

      fx.remove();

      card.style.clipPath =
        "";

      card.style.removeProperty(
        "-webkit-clip-path",
      );

      card.style.visibility =
        "";

      delete card.dataset
        .burning;
    },

    duration + 1500,
  );
}

/* =========================================================
   Component
========================================================= */

export default function BurnRecipeLink({
  href,
  className,
  children,
  duration = 950,
}: BurnRecipeLinkProps) {
  const router =
    useRouter();

  const lockedRef =
    useRef(false);

  function handleClick(
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (
      lockedRef.current
    ) {
      return;
    }

    const card =
      event.currentTarget.closest(
        "[data-recipe-card]",
      ) as HTMLElement | null;

    if (!card) {
      router.push(
        href,
      );

      return;
    }

    lockedRef.current =
      true;

    startBurnAnimation(
      card,

      event.clientX,
      event.clientY,

      duration,

      () => {
        router.push(
          href,
        );
      },
    );

    window.setTimeout(
      () => {
        lockedRef.current =
          false;
      },

      duration + 300,
    );
  }

  return (
    <a
      href={href}
      onClick={
        handleClick
      }
      className={
        className
      }
    >
      {children}
    </a>
  );
}