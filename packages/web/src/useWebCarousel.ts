import { useRef, useCallback, useEffect, UIEvent } from 'react';
import { useCarousel } from '@universal-headless-carousel/core';
import { UseWebCarouselOptions, UseWebCarouselReturn, WebContainerProps, WebItemProps } from './types';

export function useWebCarousel(options: UseWebCarouselOptions): UseWebCarouselReturn {
  const {
    snapAlign = 'center',
    scrollBehavior = 'smooth',
    hideScrollbar = true,
    ...coreOptions
  } = options;

  const core = useCarousel(coreOptions);
  const containerNodeRef = useRef<HTMLElement | null>(null);
  const itemNodesRef = useRef<Map<number, HTMLElement>>(new Map());
  
  const isScrollingProgrammatically = useRef<boolean>(false);
  const isManualScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerNodeRef.current = node;
  }, []);

  const calculateScrollOffset = useCallback(
    (index: number): number | null => {
      const container = containerNodeRef.current;
      const item = itemNodesRef.current.get(index);
      if (!container || !item) return null;

      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const relativeLeft = itemRect.left - containerRect.left + container.scrollLeft;

      if (snapAlign === 'start') {
        return relativeLeft;
      } else if (snapAlign === 'end') {
        return relativeLeft - (containerRect.width - itemRect.width);
      } else {
        // center
        return relativeLeft - (containerRect.width - itemRect.width) / 2;
      }
    },
    [snapAlign]
  );

  const scrollTo = useCallback(
    (index: number) => {
      const container = containerNodeRef.current;
      if (!container) return;

      const offset = calculateScrollOffset(index);
      if (offset === null) return;

      isScrollingProgrammatically.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      container.scrollTo({
        left: Math.max(0, offset),
        behavior: scrollBehavior
      });

      // Clear programmatic scroll flag after scroll animation completes
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 400);
    },
    [calculateScrollOffset, scrollBehavior]
  );

  // Sync scroll position when activeIndex changes in core
  useEffect(() => {
    // If state change originated from user manual scroll, do not re-trigger programmatic scrollTo
    if (isManualScroll.current) {
      isManualScroll.current = false;
      return;
    }
    scrollTo(core.activeIndex);
  }, [core.activeIndex, scrollTo]);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      if (isScrollingProgrammatically.current) return;

      const container = containerNodeRef.current;
      if (!container || options.itemsCount <= 0) return;

      const currentScrollLeft = container.scrollLeft;
      let closestIndex = core.activeIndex;
      let minDistance = Infinity;

      itemNodesRef.current.forEach((_, index) => {
        const offset = calculateScrollOffset(index);
        if (offset !== null) {
          const distance = Math.abs(offset - currentScrollLeft);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== core.activeIndex) {
        isManualScroll.current = true;
        core.goTo(closestIndex);
      }
    },
    [core, calculateScrollOffset, options.itemsCount]
  );

  const getContainerProps = useCallback(
    (customProps: Partial<WebContainerProps> = {}): WebContainerProps => {
      const coreContainerProps = core.getContainerProps(customProps);

      const hideScrollbarStyles: React.CSSProperties = hideScrollbar
        ? {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }
        : {};

      const containerStyle: React.CSSProperties = {
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        ...hideScrollbarStyles,
        ...customProps.style
      };

      return {
        ...coreContainerProps,
        ref: setContainerRef,
        style: containerStyle,
        onScroll: (e: UIEvent<HTMLElement>) => {
          if (customProps.onScroll) {
            customProps.onScroll(e);
          }
          handleScroll(e);
        }
      };
    },
    [core, setContainerRef, hideScrollbar, handleScroll]
  );

  const getItemProps = useCallback(
    (index: number, customProps: Partial<WebItemProps> = {}): WebItemProps => {
      const coreItemProps = core.getItemProps(index, customProps);

      const setItemRef = (node: HTMLElement | null) => {
        if (node) {
          itemNodesRef.current.set(index, node);
        } else {
          itemNodesRef.current.delete(index);
        }
      };

      const itemStyle: React.CSSProperties = {
        scrollSnapAlign: snapAlign,
        flexShrink: 0,
        ...customProps.style
      };

      return {
        ...coreItemProps,
        ref: setItemRef,
        style: itemStyle
      };
    },
    [core, snapAlign]
  );

  return {
    ...core,
    containerRef: setContainerRef,
    getContainerProps,
    getItemProps,
    scrollTo
  };
}
