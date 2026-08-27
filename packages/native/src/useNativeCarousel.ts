import { useRef, useCallback, useEffect } from 'react';
import { useCarousel } from 'universal-headless-carousel-core';
import { UseNativeCarouselOptions, UseNativeCarouselReturn, FlatListProps, NativeItemProps } from './types';

export function useNativeCarousel(options: UseNativeCarouselOptions): UseNativeCarouselReturn {
  const { itemWidth, ...coreOptions } = options;
  const core = useCarousel(coreOptions);
  const flatListRef = useRef<any>(null);

  const scrollTo = useCallback(
    (index: number) => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true
      });
    },
    []
  );

  useEffect(() => {
    scrollTo(core.activeIndex);
  }, [core.activeIndex, scrollTo]);

  const getFlatListProps = useCallback(
    (): FlatListProps => ({
      horizontal: true,
      pagingEnabled: false,
      snapToInterval: itemWidth,
      decelerationRate: 'fast',
      showsHorizontalScrollIndicator: false,
      getItemLayout: (_data: any, index: number) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index
      }),
      onScrollToIndexFailed: (info) => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: true
          });
        }, 50);
      }
    }),
    [itemWidth]
  );

  const getItemProps = useCallback(
    (index: number): NativeItemProps => {
      const coreProps = core.getItemProps(index);
      return {
        ...coreProps,
        style: {
          width: itemWidth
        }
      };
    },
    [core, itemWidth]
  );

  return {
    ...core,
    flatListRef,
    getFlatListProps,
    getItemProps,
    scrollTo
  };
}
