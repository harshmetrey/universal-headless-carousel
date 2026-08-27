import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, FlatList, ViewStyle } from 'react-native';
import { useNativeCarousel } from './useNativeCarousel';
import { UseNativeCarouselOptions } from './types';

export interface NativeCarouselProps extends Omit<UseNativeCarouselOptions, 'itemsCount' | 'itemWidth'> {
  /**
   * Slide items array to render.
   */
  items: ReactNode[];
  /**
   * Width of each item slide in pixels for snap calculation (e.g. 300).
   * @default 300
   */
  cardWidth?: number;
  /**
   * Height of each item slide in pixels (e.g. 200).
   */
  cardHeight?: number;
  /**
   * Show navigation arrows (Prev/Next touchables).
   * @default true
   */
  showArrows?: boolean;
  /**
   * Custom previous arrow element or render function.
   */
  prevArrow?: ReactNode | ((props: { onPress: () => void; disabled: boolean }) => ReactNode);
  /**
   * Custom next arrow element or render function.
   */
  nextArrow?: ReactNode | ((props: { onPress: () => void; disabled: boolean }) => ReactNode);
  /**
   * Show pagination dots indicator.
   * @default true
   */
  showDots?: boolean;
  /**
   * Custom pagination dot render function.
   */
  customDot?: (index: number, isActive: boolean) => ReactNode;
  /**
   * Custom root wrapper style.
   */
  containerStyle?: ViewStyle;
  /**
   * Custom card slide style.
   */
  cardStyle?: ViewStyle;
}

export function NativeCarousel({
  items = [],
  cardWidth = 300,
  cardHeight,
  loop = false,
  autoplay = 0,
  startIndex = 0,
  showArrows = true,
  prevArrow,
  nextArrow,
  showDots = true,
  customDot,
  containerStyle,
  cardStyle,
  ...restOptions
}: NativeCarouselProps) {
  const carousel = useNativeCarousel({
    itemsCount: items.length,
    itemWidth: cardWidth,
    loop,
    autoplay,
    startIndex,
    ...restOptions
  });

  const itemStyle: ViewStyle = {
    width: cardWidth,
    ...(cardHeight ? { height: cardHeight } : {}),
    ...cardStyle
  };

  const renderPrevArrow = () => {
    const disabled = !loop && carousel.isFirst;
    if (typeof prevArrow === 'function') {
      return prevArrow({ onPress: carousel.prev, disabled });
    }
    if (prevArrow) {
      return (
        <TouchableOpacity onPress={carousel.prev} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
          {prevArrow}
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={carousel.prev}
        disabled={disabled}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          opacity: disabled ? 0.5 : 1
        }}
      >
        <Text style={{ fontWeight: '600', color: '#1e293b' }}>← Prev</Text>
      </TouchableOpacity>
    );
  };

  const renderNextArrow = () => {
    const disabled = !loop && carousel.isLast;
    if (typeof nextArrow === 'function') {
      return nextArrow({ onPress: carousel.next, disabled });
    }
    if (nextArrow) {
      return (
        <TouchableOpacity onPress={carousel.next} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
          {nextArrow}
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={carousel.next}
        disabled={disabled}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          opacity: disabled ? 0.5 : 1
        }}
      >
        <Text style={{ fontWeight: '600', color: '#1e293b' }}>Next →</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{ width: '100%', alignItems: 'center' }, containerStyle]}>
      <FlatList
        ref={carousel.flatListRef}
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View key={index} style={[carousel.getItemProps(index).style, itemStyle]}>
            {item}
          </View>
        )}
        {...carousel.getFlatListProps()}
      />

      {(showArrows || showDots) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', marginTop: 12 }}>
          {showArrows ? renderPrevArrow() : <View />}

          {showDots && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {items.map((_, index) => {
                const isActive = index === carousel.activeIndex;
                if (customDot) {
                  return (
                    <TouchableOpacity key={index} onPress={() => carousel.goTo(index)}>
                      {customDot(index, isActive)}
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => carousel.goTo(index)}
                    style={{
                      width: isActive ? 20 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isActive ? '#2563eb' : '#cbd5e1',
                      marginHorizontal: 3
                    }}
                  />
                );
              })}
            </View>
          )}

          {showArrows ? renderNextArrow() : <View />}
        </View>
      )}
    </View>
  );
}
