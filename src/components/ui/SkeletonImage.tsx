"use client";

import { useState } from "react";

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function SkeletonImage({ src, alt, className = "" }: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer skeleton */}
      {(!loaded || error) && (
        <div className="absolute inset-0 bg-rose-light">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              animation: "shimmer 1.8s infinite",
            }}
          />
        </div>
      )}
      {!error && src && (
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
