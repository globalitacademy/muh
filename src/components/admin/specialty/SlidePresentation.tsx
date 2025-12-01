import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Slide {
  id: string;
  title: string;
  content: string;
  notes?: string;
}

interface SlidePresentationProps {
  slides: Slide[];
  className?: string;
}

const SlidePresentation = ({ slides, className }: SlidePresentationProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!slides || slides.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Սլայդներ չկան
        </CardContent>
      </Card>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className={cn('space-y-4', className)}>
      <Card className={cn(
        'transition-all duration-300',
        isFullscreen && 'fixed inset-4 z-50 flex flex-col'
      )}>
        <CardContent className={cn(
          'p-8',
          isFullscreen && 'flex-1 flex flex-col'
        )}>
          {/* Slide Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Սլայդ {currentSlide + 1} / {slides.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-8 w-8"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Slide Content */}
          <div className={cn(
            'flex-1 flex flex-col',
            isFullscreen && 'justify-center'
          )}>
            <h2 className={cn(
              'font-bold mb-6 text-foreground',
              isFullscreen ? 'text-4xl' : 'text-2xl'
            )}>
              {slide.title}
            </h2>
            <div 
              className={cn(
                'prose prose-slate dark:prose-invert max-w-none',
                isFullscreen && 'prose-lg'
              )}
              dangerouslySetInnerHTML={{ __html: slide.content }}
            />
          </div>

          {/* Speaker Notes */}
          {slide.notes && !isFullscreen && (
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Լրացուցիչ նշումներ:
              </p>
              <p className="text-sm text-muted-foreground">{slide.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousSlide}
          disabled={currentSlide === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Նախորդ
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentSlide
                  ? 'bg-primary w-8'
                  : 'bg-muted hover:bg-muted-foreground/50'
              )}
              aria-label={`Անցնել սլայդ ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
          className="gap-2"
        >
          Հաջորդ
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Keyboard Navigation Hint */}
      {!isFullscreen && (
        <p className="text-xs text-center text-muted-foreground">
          Օգտագործեք ← և → սեղմիչները սլայդների միջև անցնելու համար
        </p>
      )}
    </div>
  );
};

export default SlidePresentation;