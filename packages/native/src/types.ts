import { RefObject } from 'react';
import { UseCarouselOptions, UseCarouselReturn } from 'universal-headless-carousel-core';

export interface UseNativeCarouselOptions extends UseCarouselOptions {
  /**
   * Width of each item in points/pixels for React Native snapToInterval calculation.
   */
  itemWidth?: number;
  /**
   * Viewability threshold percentage for onViewableItemsChanged.
   * @default 50
   */
  viewabilityThreshold?: number;
  /**
   * Whether to animate programmatic scrolling.
   * @default true
   */
  animated?: boolean;
}

export interface FlatListProps<T = any> {
  horizontal: boolean;
  pagingEnabled?: boolean;
  snapToInterval?: number;
  decelerationRate?: 'fast' | 'normal' | number;
  showsHorizontalScrollIndicator: boolean;
  onViewableItemsChanged: (info: { viewableItems: Array<{ index: number | null }> }) => void;
  viewabilityConfig: { itemVisiblePercentThreshold: number };
  getItemLayout?: (data: T[] | null | undefined, index: number) => { length: number; offset: number; index: number };
  accessibilityRole: string;
}

export interface NativeItemProps {
  accessibilityRole: string;
  accessibilityLabel: string;
  accessibilityState: { selected: boolean };
}

export interface UseNativeCarouselReturn extends Omit<UseCarouselReturn, 'getContainerProps' | 'getItemProps'> {
  flatListRef: RefObject<any>;
  getFlatListProps: (customProps?: Partial<FlatListProps>) => FlatListProps;
  getItemProps: (index: number, customProps?: Partial<NativeItemProps>) => NativeItemProps;
  scrollToIndex: (index: number, animated?: boolean) => void;
}
