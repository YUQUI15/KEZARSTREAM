"use client";

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getPosterUrl, getImageProxyUrl } from '@/lib/image';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null;
  rawPath?: string | null; // e.g. item.poster_path (/vw7uq3jG3UI2AaogDnjdATJpmtY.jpg)
  tmdbSize?: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  rawPath,
  tmdbSize = 'w342',
  fallbackSrc = '/placeholder-poster.svg',
  alt,
  className,
  ...props
}: SafeImageProps) {
  // Determinar la ruta base
  const targetPath = rawPath || (src && !src.startsWith('http') && !src.startsWith('/') ? `/${src}` : null);
  
  const getInitialSrc = (): string => {
    if (targetPath) {
      return getPosterUrl(targetPath, tmdbSize);
    }
    if (src) {
      // Si ya tiene image.tmdb.org, reemplazarlo por BunnyCDN directamente
      if (src.includes('image.tmdb.org')) {
        return src.replace('image.tmdb.org', 'tmdb-image-prod.b-cdn.net');
      }
      return src;
    }
    return fallbackSrc;
  };

  const [currentSrc, setCurrentSrc] = useState<string>(getInitialSrc());
  const [attemptStage, setAttemptStage] = useState<number>(0); // 0: CDN, 1: Proxy, 2: SVG Fallback

  useEffect(() => {
    setCurrentSrc(getInitialSrc());
    setAttemptStage(0);
  }, [src, rawPath, tmdbSize]);

  const handleError = () => {
    if (attemptStage === 0 && (targetPath || currentSrc.includes('.jpg') || currentSrc.includes('.png'))) {
      // Etapa 1: Fallback a nuestro proxy serverless local en Vercel
      const extractedPath = targetPath || currentSrc.split('/t/p/')[1]?.split('/').slice(1).join('/') ? `/${currentSrc.split('/t/p/')[1]?.split('/').slice(1).join('/')}` : null;
      if (extractedPath) {
        setAttemptStage(1);
        setCurrentSrc(getImageProxyUrl(extractedPath, tmdbSize));
        return;
      }
    }

    // Etapa 2: Fallback final garantizado al SVG local del proyecto
    setAttemptStage(2);
    setCurrentSrc(fallbackSrc);
  };

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || 'Imagen'}
      className={className}
      unoptimized
      onError={handleError}
    />
  );
}
