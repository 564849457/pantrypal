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

type ParticleType =
  | "fire"
  | "ember"
  | "ash";

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

  type: ParticleType;
};

type BurnPoint = {
  x: number;
  y: number;
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

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.max(
    min,
    Math.min(
      max,
      value,
    ),
  );
}

/* =========================================================
   Distance
========================================================= */

function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const dx =
    x2 - x1;

  const dy =
    y2 - y1;

  return Math.sqrt(
    dx * dx +
      dy * dy,
  );
}

/* =========================================================
   Maximum radius needed to cover card
========================================================= */

function getMaximumRadius(
  originX: number,
  originY: number,
  width: number,
  height: number,
) {
  const corners: Array<
    [number, number]
  > = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ];

  let maxRadius = 0;

  for (
    const [x, y] of corners
  ) {
    maxRadius =
      Math.max(
        maxRadius,
        distance(
          originX,
          originY,
          x,
          y,
        ),
      );
  }

  return maxRadius;
}

/* =========================================================
   Easing
========================================================= */

function easeOutCubic(
  value: number,
) {
  return (
    1 -
    Math.pow(
      1 - value,
      3,
    )
  );
}

/* =========================================================
   Irregular radial edge
========================================================= */

function getIrregularRadius(
  angle: number,
  baseRadius: number,
  progress: number,
  seed: number,
  maximumRadius: number,
) {
  const wave1 =
    Math.sin(
      angle * 5 +
        seed +
        progress * 4.5,
    ) * 13;

  const wave2 =
    Math.sin(
      angle * 9 -
        seed * 0.8 -
        progress * 7,
    ) * 8;

  const wave3 =
    Math.sin(
      angle * 17 +
        seed * 1.3 +
        progress * 10,
    ) * 4;

  const wave4 =
    Math.sin(
      angle * 27 -
        progress * 13,
    ) * 2;

  const irregularityScale =
    Math.min(
      1,
      baseRadius / 65,
    );

  const result =
    baseRadius +
    (
      wave1 +
      wave2 +
      wave3 +
      wave4
    ) *
      irregularityScale;

  return clamp(
    result,
    0,
    maximumRadius,
  );
}

/* =========================================================
   Build burn boundary

   IMPORTANT:
   We do NOT clamp X/Y to card bounds.
   This prevents straight-line / rectangle artifacts.
========================================================= */

function buildBurnPoints(
  originX: number,
  originY: number,
  radius: number,
  progress: number,
  seed: number,
  maximumRadius: number,
) {
  const points: BurnPoint[] =
    [];

  const segments =
    84;

  for (
    let i = 0;
    i < segments;
    i += 1
  ) {
    const angle =
      (
        i /
        segments
      ) *
      Math.PI *
      2;

    const irregularRadius =
      getIrregularRadius(
        angle,
        radius,
        progress,
        seed,
        maximumRadius,
      );

    const x =
      originX +
      Math.cos(angle) *
        irregularRadius;

    const y =
      originY +
      Math.sin(angle) *
        irregularRadius;

    points.push({
      x,
      y,
    });
  }

  return points;
}

/* =========================================================
   SVG clip path

   Full rectangle minus irregular burn hole
========================================================= */

function buildClipPathData(
  width: number,
  height: number,
  burnPoints: BurnPoint[],
) {
  let data =
    `M 0 0 ` +
    `H ${width} ` +
    `V ${height} ` +
    `H 0 Z `;

  if (
    burnPoints.length ===
    0
  ) {
    return data;
  }

  const first =
    burnPoints[0];

  data +=
    `M ${first.x} ${first.y} `;

  for (
    let i = 1;
    i <
    burnPoints.length;
    i += 1
  ) {
    const point =
      burnPoints[i];

    data +=
      `L ${point.x} ${point.y} `;
  }

  data += "Z";

  return data;
}

/* =========================================================
   Start burn animation
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

  /* =======================================================
     Click origin
  ======================================================== */

  const originX =
    clamp(
      clickX -
        rect.left,
      0,
      width,
    );

  const originY =
    clamp(
      clickY -
        rect.top,
      0,
      height,
    );

  const maximumRadius =
    getMaximumRadius(
      originX,
      originY,
      width,
      height,
    );

  const burnSeed =
    Math.random() *
    Math.PI *
    20;

  /* =======================================================
     SVG clip path
  ======================================================== */

  const svgNamespace =
    "http://www.w3.org/2000/svg";

  const svg =
    document.createElementNS(
      svgNamespace,
      "svg",
    );

  const defs =
    document.createElementNS(
      svgNamespace,
      "defs",
    );

  const clipPathElement =
    document.createElementNS(
      svgNamespace,
      "clipPath",
    );

  const path =
    document.createElementNS(
      svgNamespace,
      "path",
    );

  const clipId =
    `recipe-burn-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

  svg.setAttribute(
    "width",
    "0",
  );

  svg.setAttribute(
    "height",
    "0",
  );

  svg.style.position =
    "fixed";

  svg.style.pointerEvents =
    "none";

  clipPathElement.setAttribute(
    "id",
    clipId,
  );

  clipPathElement.setAttribute(
    "clipPathUnits",
    "userSpaceOnUse",
  );

  path.setAttribute(
    "clip-rule",
    "evenodd",
  );

  path.setAttribute(
    "fill-rule",
    "evenodd",
  );

  clipPathElement.appendChild(
    path,
  );

  defs.appendChild(
    clipPathElement,
  );

  svg.appendChild(
    defs,
  );

  document.body.appendChild(
    svg,
  );

  card.style.clipPath =
    `url(#${clipId})`;

  card.style.setProperty(
    "-webkit-clip-path",
    `url(#${clipId})`,
  );

  card.style.transition =
    "none";

  /* =======================================================
     FX canvas
  ======================================================== */

  const extraTop =
    90;

  const extraBottom =
    60;

  const extraSide =
    60;

  const canvasWidth =
    width +
    extraSide * 2;

  const canvasHeight =
    height +
    extraTop +
    extraBottom;

  const fx =
    document.createElement(
      "div",
    );

  fx.style.position =
    "fixed";

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
    `${canvasWidth}px`;

  fx.style.height =
    `${canvasHeight}px`;

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

  canvas.style.position =
    "absolute";

  canvas.style.inset =
    "0";

  canvas.style.width =
    `${canvasWidth}px`;

  canvas.style.height =
    `${canvasHeight}px`;

  fx.appendChild(
    canvas,
  );

  document.body.appendChild(
    fx,
  );

  const context =
    canvas.getContext(
      "2d",
    );

  if (!context) {
    fx.remove();

    svg.remove();

    card.style.clipPath =
      "";

    card.style.removeProperty(
      "-webkit-clip-path",
    );

    card.style.transition =
      "";

    delete card.dataset
      .burning;

    onComplete();

    return;
  }

  const ctx: CanvasRenderingContext2D =
    context;

  const canvasElement: HTMLCanvasElement =
    canvas;

  const dpr =
    Math.min(
      window.devicePixelRatio ||
        1,
      2,
    );

  canvasElement.width =
    Math.floor(
      canvasWidth *
        dpr,
    );

  canvasElement.height =
    Math.floor(
      canvasHeight *
        dpr,
    );

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0,
  );

  const offsetX =
    extraSide;

  const offsetY =
    extraTop;

  const particles: Particle[] =
    [];

  const startTime =
    performance.now();

  let animationId =
    0;

  /* =======================================================
     Add particle
  ======================================================== */

  function addParticle(
    x: number,
    y: number,
    angle: number,
    type: ParticleType,
  ) {
    const outwardX =
      Math.cos(
        angle,
      );

    const outwardY =
      Math.sin(
        angle,
      );

    /* ---------------------------------------
       FIRE
    --------------------------------------- */

    if (
      type ===
      "fire"
    ) {
      particles.push({
        x:
          x +
          offsetX,

        y:
          y +
          offsetY,

        vx:
          outwardX *
            random(
              0.05,
              0.7,
            ) +
          random(
            -0.45,
            0.45,
          ),

        vy:
          -random(
            1.7,
            4.2,
          ) +
          outwardY *
            0.25,

        size:
          random(
            1.8,
            4.8,
          ),

        life:
          0,

        maxLife:
          random(
            16,
            32,
          ),

        alpha:
          random(
            0.65,
            1,
          ),

        glow:
          random(
            10,
            22,
          ),

        type,
      });

      return;
    }

    /* ---------------------------------------
       ASH
    --------------------------------------- */

    if (
      type ===
      "ash"
    ) {
      particles.push({
        x:
          x +
          offsetX,

        y:
          y +
          offsetY,

        vx:
          outwardX *
            random(
              0.15,
              0.9,
            ) +
          random(
            -0.45,
            0.45,
          ),

        vy:
          outwardY *
            random(
              0.1,
              0.55,
            ) -
          random(
            0.15,
            0.7,
          ),

        size:
          random(
            0.7,
            2.5,
          ),

        life:
          0,

        maxLife:
          random(
            30,
            62,
          ),

        alpha:
          random(
            0.2,
            0.55,
          ),

        glow:
          0,

        type,
      });

      return;
    }

    /* ---------------------------------------
       EMBER
    --------------------------------------- */

    particles.push({
      x:
        x +
        offsetX,

      y:
        y +
        offsetY,

      vx:
        outwardX *
          random(
            0.3,
            1.55,
          ) +
        random(
          -0.55,
          0.55,
        ),

      vy:
        outwardY *
          random(
            0.1,
            0.75,
          ) -
        random(
          0.8,
          2.8,
        ),

      size:
        random(
          0.8,
          2.8,
        ),

      life:
        0,

      maxLife:
        random(
          20,
          48,
        ),

      alpha:
        random(
          0.45,
          1,
        ),

      glow:
        random(
          6,
          16,
        ),

      type,
    });
  }

  /* =======================================================
     Initial ignition burst
  ======================================================== */

  function createIgnitionBurst() {
    for (
      let i = 0;
      i < 32;
      i += 1
    ) {
      const angle =
        random(
          0,
          Math.PI *
            2,
        );

      const radius =
        random(
          0,
          14,
        );

      const x =
        originX +
        Math.cos(
          angle,
        ) *
          radius;

      const y =
        originY +
        Math.sin(
          angle,
        ) *
          radius;

      addParticle(
        x,
        y,
        angle,
        Math.random() <
          0.78
          ? "ember"
          : "fire",
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

    /* ---------------------------------------
       Ash
    --------------------------------------- */

    if (
      particle.type ===
      "ash"
    ) {
      ctx.beginPath();

      ctx.fillStyle =
        `rgba(
          78,
          64,
          55,
          ${
            particle.alpha *
            ratio
          }
        )`;

      ctx.arc(
        particle.x,
        particle.y,
        Math.max(
          0.4,
          particle.size *
            ratio,
        ),
        0,
        Math.PI *
          2,
      );

      ctx.fill();

      return;
    }

    const radius =
      Math.max(
        0.45,
        particle.size *
          ratio,
      );

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

    /* ---------------------------------------
       Fire
    --------------------------------------- */

    if (
      particle.type ===
      "fire"
    ) {
      gradient.addColorStop(
        0,
        `rgba(
          255,
          255,
          225,
          ${
            particle.alpha *
            ratio
          }
        )`,
      );

      gradient.addColorStop(
        0.18,
        `rgba(
          255,
          215,
          100,
          ${
            particle.alpha *
            ratio *
            0.9
          }
        )`,
      );

      gradient.addColorStop(
        0.52,
        `rgba(
          255,
          100,
          15,
          ${
            ratio *
            0.44
          }
        )`,
      );

      gradient.addColorStop(
        1,
        "rgba(255,50,0,0)",
      );
    } else {
      /* -------------------------------------
         Ember
      ------------------------------------- */

      gradient.addColorStop(
        0,
        `rgba(
          255,
          245,
          200,
          ${
            particle.alpha *
            ratio
          }
        )`,
      );

      gradient.addColorStop(
        0.25,
        `rgba(
          255,
          160,
          45,
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
          70,
          5,
          ${
            ratio *
            0.22
          }
        )`,
      );

      gradient.addColorStop(
        1,
        "rgba(255,50,0,0)",
      );
    }

    ctx.beginPath();

    ctx.fillStyle =
      gradient;

    ctx.arc(
      particle.x,
      particle.y,
      glowRadius,
      0,
      Math.PI *
        2,
    );

    ctx.fill();

    /* Bright core */

    ctx.beginPath();

    ctx.fillStyle =
      `rgba(
        255,
        235,
        175,
        ${
          particle.alpha *
          ratio
        }
      )`;

    ctx.arc(
      particle.x,
      particle.y,
      radius,
      0,
      Math.PI *
        2,
    );

    ctx.fill();
  }

  /* =======================================================
     Update particle
  ======================================================== */

  function updateParticle(
    particle: Particle,
  ) {
    particle.life +=
      1;

    particle.x +=
      particle.vx;

    particle.y +=
      particle.vy;

    if (
      particle.type ===
      "ash"
    ) {
      particle.vy +=
        0.018;

      particle.vx +=
        Math.sin(
          particle.life *
            0.18,
        ) *
        0.016;
    } else {
      particle.vy -=
        0.003;

      particle.vx +=
        Math.sin(
          particle.life *
            0.22,
        ) *
        0.01;
    }

    particle.vx *=
      0.994;
  }

  /* =======================================================
     Draw burn edge

     IMPORTANT:
     Burn geometry is unrestricted,
     but rendering is CLIPPED to card bounds.

     This removes the orange rectangle artifact.
  ======================================================== */

  function drawBurnEdge(
    burnPoints: BurnPoint[],
    progress: number,
  ) {
    if (
      burnPoints.length <
      2
    ) {
      return;
    }

    ctx.save();

    /* ---------------------------------------
       Correct hard boundary:
       clip canvas rendering to card rectangle
    --------------------------------------- */

    ctx.beginPath();

    ctx.rect(
      offsetX,
      offsetY,
      width,
      height,
    );

    ctx.clip();

    ctx.lineJoin =
      "round";

    ctx.lineCap =
      "round";

    ctx.beginPath();

    for (
      let i = 0;
      i <
      burnPoints.length;
      i += 1
    ) {
      const point =
        burnPoints[i];

      const x =
        point.x +
        offsetX;

      const y =
        point.y +
        offsetY;

      if (
        i === 0
      ) {
        ctx.moveTo(
          x,
          y,
        );
      } else {
        ctx.lineTo(
          x,
          y,
        );
      }
    }

    ctx.closePath();

    /* ---------------------------------------
       Outer red glow
    --------------------------------------- */

    ctx.strokeStyle =
      `rgba(
        255,
        60,
        5,
        ${
          0.18 *
          (
            1 -
            progress *
              0.55
          )
        }
      )`;

    ctx.lineWidth =
      14;

    ctx.shadowColor =
      "rgba(255,70,0,0.38)";

    ctx.shadowBlur =
      14;

    ctx.stroke();

    /* ---------------------------------------
       Orange burn edge
    --------------------------------------- */

    ctx.strokeStyle =
      `rgba(
        255,
        125,
        20,
        ${
          0.68 *
          (
            1 -
            progress *
              0.38
          )
        }
      )`;

    ctx.lineWidth =
      5;

    ctx.shadowColor =
      "rgba(255,120,20,0.65)";

    ctx.shadowBlur =
      8;

    ctx.stroke();

    /* ---------------------------------------
       White-hot line
    --------------------------------------- */

    ctx.strokeStyle =
      `rgba(
        255,
        225,
        150,
        ${
          0.78 *
          (
            1 -
            progress *
              0.5
          )
        }
      )`;

    ctx.lineWidth =
      1.5;

    ctx.shadowColor =
      "rgba(255,220,140,0.6)";

    ctx.shadowBlur =
      4;

    ctx.stroke();

    ctx.restore();
  }

  /* =======================================================
     Emit particles

     Only generate particles from points still
     inside this recipe card.
  ======================================================== */

  function emitEdgeParticles(
    burnPoints: BurnPoint[],
    progress: number,
  ) {
    const count =
      progress <
      0.65
        ? 11
        : 6;

    for (
      let i = 0;
      i < count;
      i += 1
    ) {
      const index =
        Math.floor(
          Math.random() *
            burnPoints.length,
        );

      const point =
        burnPoints[index];

      /* ---------------------------------------
         Ignore burn edge portions already
         outside this specific card.
      --------------------------------------- */

      if (
        point.x < 0 ||
        point.x > width ||
        point.y < 0 ||
        point.y > height
      ) {
        continue;
      }

      const angle =
        Math.atan2(
          point.y -
            originY,
          point.x -
            originX,
        );

      const roll =
        Math.random();

      let type: ParticleType =
        "ember";

      if (
        roll < 0.18
      ) {
        type =
          "fire";
      } else if (
        roll > 0.86
      ) {
        type =
          "ash";
      }

      addParticle(
        point.x +
          random(
            -2,
            2,
          ),

        point.y +
          random(
            -2,
            2,
          ),

        angle,

        type,
      );
    }
  }

  /* =======================================================
     Main animation
  ======================================================== */

  function frame(
    now: number,
  ) {
    const elapsed =
      now -
      startTime;

    const rawProgress =
      Math.min(
        elapsed /
          duration,
        1,
      );

    const progress =
      easeOutCubic(
        rawProgress,
      );

    const baseRadius =
      3 +
      progress *
        Math.max(
          0,
          maximumRadius -
            3,
        );

    const burnPoints =
      buildBurnPoints(
        originX,
        originY,
        baseRadius,
        progress,
        burnSeed,
        maximumRadius,
      );

    /* ---------------------------------------
       Actual card clip
    --------------------------------------- */

    const clipData =
      buildClipPathData(
        width,
        height,
        burnPoints,
      );

    path.setAttribute(
      "d",
      clipData,
    );

    /* ---------------------------------------
       Clear FX layer
    --------------------------------------- */

    ctx.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight,
    );

    /* ---------------------------------------
       Draw burn edge
    --------------------------------------- */

    drawBurnEdge(
      burnPoints,
      rawProgress,
    );

    /* ---------------------------------------
       Emit particles
    --------------------------------------- */

    if (
      rawProgress <
      0.92
    ) {
      emitEdgeParticles(
        burnPoints,
        rawProgress,
      );
    }

    /* ---------------------------------------
       Draw particles
    --------------------------------------- */

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
      rawProgress <
      1
    ) {
      animationId =
        requestAnimationFrame(
          frame,
        );

      return;
    }

    /* Final state */

    card.style.visibility =
      "hidden";
  }

  /* =======================================================
     Start
  ======================================================== */

  createIgnitionBurst();

  animationId =
    requestAnimationFrame(
      frame,
    );

  /* =======================================================
     Navigate after animation
  ======================================================== */

  window.setTimeout(
    () => {
      onComplete();
    },
    duration +
      70,
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

      svg.remove();

      card.style.clipPath =
        "";

      card.style.removeProperty(
        "-webkit-clip-path",
      );

      card.style.visibility =
        "";

      card.style.transition =
        "";

      delete card.dataset
        .burning;
    },

    duration +
      1400,
  );
}

/* =========================================================
   Component
========================================================= */

export default function BurnRecipeLink({
  href,
  className,
  children,
  duration = 1000,
}: BurnRecipeLinkProps) {
  const router =
    useRouter();

  const lockedRef =
    useRef(false);

  function handleClick(
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    /*
     * Preserve native browser behaviour:
     *
     * Ctrl click
     * Cmd click
     * Shift click
     * Alt click
     * middle-click
     */

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

      duration +
        350,
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