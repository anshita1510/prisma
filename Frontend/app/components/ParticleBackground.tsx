"use client";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadBasic } from "@tsparticles/basic";
import type { ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  background: {
    color: { value: "transparent" },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: ["attract", "bubble"] },
      resize: { enable: true },
    },
    modes: {
      push: { quantity: 4 },
      attract: { 
        distance: 200, 
        duration: 0.4,
        factor: 5
      },
      bubble: {
        distance: 150,
        size: 12,
        duration: 2,
        opacity: 1,
        speed: 3
      },
      repulse: { 
        distance: 100, 
        duration: 0.4 
      },
    },
  },
  particles: {
    color: {
      value: ["#3B82F6", "#8B5CF6", "#EC4899", "#F97316", "#06B6D4", "#10B981"],
    },
    links: { enable: false },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "bounce" },
      random: true,
      speed: { min: 0.5, max: 1.5 },
      straight: false,
      drift: 0.3,
      gravity: { enable: true, acceleration: 0.01 },
      attract: {
        enable: true,
        rotate: {
          x: 600,
          y: 1200
        }
      },
    },
    number: {
      density: { 
        enable: true, 
        width: 1920,
        height: 1080
      },
      value: 80,
    },
    opacity: {
      value: { min: 0.3, max: 0.8 },
      animation: { enable: true, speed: 1, sync: false },
    },
    shape: { type: "circle" },
    size: {
      value: { min: 2, max: 8 },
      animation: { enable: true, speed: 2, sync: false },
    },
    shadow: {
      enable: true,
      blur: 5,
      color: { value: "#3B82F6" },
      offset: { x: 0, y: 0 },
    },
  },
  detectRetina: true,
  smooth: true,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
};

export default function ParticleBackground() {
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadBasic(engine);
    }).then(() => setEngineReady(true));
  }, []);

  if (!engineReady) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}