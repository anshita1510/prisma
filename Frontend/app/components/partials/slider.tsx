'use client'
import React from "react";
// WORKING VERSION ✅
// This slider runs WITHOUT tailwind.config.js
// Uses Tailwind for styling + inline CSS animation

export default function CompanyNameSlider() {
  const logos = [
    {
      name: "Google",
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      name: "Microsoft",
      src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "Amazon",
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      name: "Netflix",
      src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    },
    {
      name: "signity",
      src: "data:image/jpeg;base64,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",
    },
    {
      name: "Spotify",
      src: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    },
    {
      name: "Salesforce",
      src: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    },
    {
      name: "uber",
      src: "https://cdn.iconscout.com/icon/free/png-512/free-uber-logo-icon-svg-download-png-2284862.png?f=webp&w=512",
    },
  ];

  return (
    <section className="w-full overflow-hidden bg-gray-50 py-10">
      <div className="relative overflow-hidden">
        <div
          className="flex w-max gap-16 px-6"
          style={{ animation: "slideLTR 20s linear infinite" }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.name}
              className="h-10 md:h-12 w-auto object-contain opacity-80 transition"
            />
          ))}
        </div>
      </div>

      {/* Animation definition */}
      <style>{`
        @keyframes slideLTR {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}
