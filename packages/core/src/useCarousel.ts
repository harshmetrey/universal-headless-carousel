import { useState, useEffect, useCallback, useRef, KeyboardEvent, MouseEvent } from 'react';
import { UseCarouselOptions, UseCarouselReturn, ContainerProps, ItemProps } from './types';

export function useCarousel(options: UseCarouselOptions): UseCarouselReturn {
  const {
    itemsCount,
    loop = false,
    autoplay = 0,
    startIndex = 0,
    ariaLabel = 'Carousel'
  } = options;

  const sanitizeIndex = useCallback(
    (idx: number): number => {
      if (itemsCount <= 0) return 0;
      if (loop) {
        return ((idx % itemsCount) + itemsCount) % itemsCount;
      }
      return Math.max(0, Math.min(itemsCount - 1, idx));
    },
    [itemsCount, loop]
  );

  const [activeIndex, setActiveIndex] = useState<number>(() => sanitizeIndex(startIndex));
  
  const intervalMs = typeof autoplay === 'number' ? autoplay : autoplay ? 3000 : 0;
  const isAutoplayEnabled = intervalMs > 0;
  
  const [isPlaying, setIsPlaying] = useState<boolean>(isAutoplayEnabled);
  const isHoveredRef = useRef<boolean>(false);

  // Sync activeIndex if itemsCount changes and index is out of bounds
  useEffect(() => {
    setActiveIndex((prev: number) => sanitizeIndex(prev));
  }, [itemsCount, sanitizeIndex]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(sanitizeIndex(index));
    },
    [sanitizeIndex]
  );

  const next = useCallback(() => {
    if (itemsCount <= 0) return;
    setActiveIndex((prev: number) => {
      if (prev >= itemsCount - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [itemsCount, loop]);

  const prev = useCallback(() => {
    if (itemsCount <= 0) return;
    setActiveIndex((prev: number) => {
      if (prev <= 0) {
        return loop ? itemsCount - 1 : 0;
      }
      return prev - 1;
    });
  }, [itemsCount, loop]);

  const play = useCallback(() => {
    if (isAutoplayEnabled) {
      setIsPlaying(true);
    }
  }, [isAutoplayEnabled]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Autoplay timer effect
  useEffect(() => {
    if (!isPlaying || !isAutoplayEnabled || itemsCount <= 1 || isHoveredRef.current) {
      return;
    }

    const timer = setInterval(() => {
      next();
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, isAutoplayEnabled, intervalMs, itemsCount, next]);

  const isFirst = activeIndex === 0;
  const isLast = itemsCount <= 0 ? true : activeIndex === itemsCount - 1;

  const getContainerProps = useCallback(
    (customProps: Partial<ContainerProps> = {}): ContainerProps => {
      return {
        role: 'region',
        'aria-roledescription': 'carousel',
        'aria-label': customProps['aria-label'] || ariaLabel,
        tabIndex: customProps.tabIndex ?? 0,
        ...customProps,
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if (customProps.onKeyDown) {
            customProps.onKeyDown(e);
          }
          if (e.defaultPrevented) return;

          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              prev();
              break;
            case 'ArrowRight':
              e.preventDefault();
              next();
              break;
            case 'Home':
              e.preventDefault();
              goTo(0);
              break;
            case 'End':
              e.preventDefault();
              goTo(itemsCount - 1);
              break;
          }
        },
        onMouseEnter: (e: MouseEvent<HTMLElement>) => {
          if (customProps.onMouseEnter) {
            customProps.onMouseEnter(e);
          }
          isHoveredRef.current = true;
          if (isAutoplayEnabled) {
            setIsPlaying(false);
          }
        },
        onMouseLeave: (e: MouseEvent<HTMLElement>) => {
          if (customProps.onMouseLeave) {
            customProps.onMouseLeave(e);
          }
          isHoveredRef.current = false;
          if (isAutoplayEnabled) {
            setIsPlaying(true);
          }
        }
      };
    },
    [ariaLabel, prev, next, goTo, itemsCount, isAutoplayEnabled]
  );

  const getItemProps = useCallback(
    (index: number, customProps: Partial<ItemProps> = {}): ItemProps => {
      const isActive = index === activeIndex;
      return {
        role: 'group',
        'aria-roledescription': 'slide',
        'aria-label': customProps['aria-label'] || `Slide ${index + 1} of ${itemsCount}`,
        'aria-hidden': !isActive,
        'data-index': index,
        'data-active': isActive,
        ...customProps
      };
    },
    [activeIndex, itemsCount]
  );

  return {
    activeIndex,
    next,
    prev,
    goTo,
    isFirst,
    isLast,
    isPlaying,
    play,
    pause,
    getContainerProps,
    getItemProps
  };
}
