"use client";

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import TopCard from './TopCard';
import { Media } from '@/types/tmdb';

interface CarouselProps {
  title?: string;
  items: Media[];
  cardType?: 'poster' | 'top';
}

export default function Carousel({ title = '', items, cardType = 'poster' }: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-blue-500 pl-3">
          {title}
        </h2>
        
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-900/50 hover:bg-blue-600 text-white transition-colors border border-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-900/50 hover:bg-blue-600 text-white transition-colors border border-gray-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex-shrink-0 snap-start">
            {cardType === 'poster' ? (
              <div className="w-[140px] md:w-[180px]">
                <MovieCard media={item} />
              </div>
            ) : (
              <TopCard media={item} index={index} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
