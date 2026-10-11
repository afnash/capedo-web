"use client";

import { useState } from "react";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  className = "",
  wrapperClassName = "",
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${wrapperClassName}`}>
      {/* Skeleton Pulse Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200/50 to-gray-100 animate-pulse transition-opacity duration-500 pointer-events-none ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Image with smooth fade-in */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-500 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
}
