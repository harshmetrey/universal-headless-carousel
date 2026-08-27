import { useRef, useCallback, useEffect } from 'react';
import { useCarousel } from '@universal-headless-carousel/core';
import { UseNativeCarouselOptions, UseNativeCarouselReturn, FlatListProps, NativeItemProps } from './types';

export function useNativeCarousel(options: UseNativeCarouselOptions): UseNativeCarouselReturn {
  const {
    itemWidth,
    viewabilityThreshold = 50,
    animated = true,
    ...coreOptions
  } = options;

  const core = useCarousel(coreOptions);
  const flatListRef = useRef<any>(null);
  const isScrollingProgrammatically = useRef<boolean>(false);

  const scrollToIndex = useCallback(
    (index: number, isAnimated = animated) => {
      if (!flatListRef.current || options.itemsCount <= 0) return;
      const safeIndex = Math.max(0, Math.min(options.itemsCount - 1, index));

      isScrollingProgrammatically.current = true;
      try {
        flatListRef.current.scrollToIndex({
          index: safeIndex,
          animated: isAnimated
        });
      } catch (err) {
        // Fallback to scrollToOffset if item layout is not pre-computed
        if (itemWidth) {
          flatListRef.current.scrollToOffset({
            offset: safeIndex * itemWidth,
            animated: isAnimated
          });
        }
      }

      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 300);
    },
    [animated, options.itemsCount, itemWidth]
  );

  // Sync scroll position when activeIndex changes in core
  useEffect(() => {
    scrollToIndex(core.activeIndex);
  }, [core.activeIndex, scrollToIndex]);

  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<{ index: number | null }> }) => {
      if (isScrollingProgrammatically.current) return;
      if (info.viewableItems.length > 0) {
        const firstVisibleIndex = info.viewableItems[0].index;
        if (firstVisibleIndex !== null && firstVisibleIndex !== undefined && firstVisibleIndex !== core.activeIndex) {
          core.goTo(firstVisibleIndex);
        }
      }
    },
    [core]
  );

  const getFlatListProps = useCallback(
    (customProps: Partial<FlatListProps> = {}): FlatListProps => {
      const baseProps: FlatListProps = {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        onViewableItemsChanged: (info) => {
          if (customProps.onViewableItemsChanged) {
            customProps.onViewableItemsChanged(info);
          }
          onViewableItemsChanged(info);
        },
        viewabilityConfig: customProps.viewabilityConfig || {
          itemVisiblePercentThreshold: viewabilityThreshold
        },
        accessibilityRole: 'adjustable',
        ...customProps
      };

      if (itemWidth) {
        baseProps.snapToInterval = itemWidth;
        baseProps.decelerationRate = 'fast';
        baseProps.getItemLayout = customProps.getItemLayout || ((_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index
        }));
      } else {
        baseProps.pagingEnabled = true;
      }

      return baseProps;
    },
    [onViewableItemsChanged, viewabilityThreshold, itemWidth]
  );

  const getItemProps = useCallback(
    (index: number, customProps: Partial<NativeItemProps> = {}): NativeItemProps => {
      const isActive = index === core.activeIndex;
      return {
        accessibilityRole: 'none',
        accessibilityLabel: customProps.accessibilityLabel || `Slide ${index + 1} of ${options.itemsCount}`,
        accessibilityState: { selected: isActive },
        ...customProps
      };
    },
    [core.activeIndex, options.itemsCount]
  );

  return {
    ...core,
    flatListRef,
    getFlatListProps,
    getItemProps,
    scrollToIndex
  };
}
