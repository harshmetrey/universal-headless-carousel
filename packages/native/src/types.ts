import { RefObject } from 'react';
import { FlatListProps as RNFlatListProps, ViewStyle } from 'react-native';
import { UseCarouselOptions, UseCarouselReturn, ItemProps } from 'universal-headless-carousel-core';

export interface UseNativeCarouselOptions extends UseCarouselOptions {
  /**
   * Width of each item slide in pixels for snapToInterval calculation.
   */
  itemWidth: number;
}

export interface NativeItemProps extends Omit<ItemProps, 'style'> {
  style?: ViewStyle;
}

export interface FlatListProps extends Partial<RNFlatListProps<any>> {
  horizontal: boolean;
  pagingEnabled?: boolean;
  snapToInterval?: number;
  decelerationRate?: 'fast' | 'normal' | number;
  showsHorizontalScrollIndicator: boolean;
  onScrollToIndexFailed?: (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => void;
  getItemLayout?: (data: any, index: number) => { length: number; offset: number; index: number };
}

export interface UseNativeCarouselReturn extends Omit<UseCarouselReturn, 'getItemProps'> {
  flatListRef: RefObject<any>;
  getFlatListProps: () => FlatListProps;
  getItemProps: (index: number) => NativeItemProps;
  scrollTo: (index: number) => void;
}
