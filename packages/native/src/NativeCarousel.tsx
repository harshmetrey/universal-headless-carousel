import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, FlatList, ViewStyle } from 'react-native';
import { useNativeCarousel } from './useNativeCarousel';
import { UseNativeCarouselOptions } from './types';

export interface NativeCarouselProps extends Omit<UseNativeCarouselOptions, 'itemsCount'> {
  /**
   * Slide items array to render.
   */
  items: ReactNode[];
  /**
   * Show navigation arrows (Prev/Next touchables).
   * @default true
   */
  showArrows?: boolean;
  /**
   * Show pagination dots indicator.
   * @default true
   */
  showDots?: boolean;
  /**
   * Custom root wrapper style.
   */
  containerStyle?: ViewStyle;
}

export function NativeCarousel({
  items = [],
  itemWidth = 300,
  loop = false,
  autoplay = 0,
  startIndex = 0,
  showArrows = true,
  showDots = true,
  containerStyle,
  ...restOptions
}: NativeCarouselProps) {
  const carousel = useNativeCarousel({
    itemsCount: items.length,
    itemWidth,
    loop,
    autoplay,
    startIndex,
    ...restOptions
  });

  return (
    <View style={[{ width: '100%', alignItems: 'center' }, containerStyle]}>
      <FlatList
        ref={carousel.flatListRef}
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View key={index} style={carousel.getItemProps(index).style}>
            {item}
          </View>
        )}
        {...carousel.getFlatListProps()}
      />

      {(showArrows || showDots) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', marginTop: 12 }}>
          {showArrows ? (
            <TouchableOpacity
              onPress={carousel.prev}
              disabled={!loop && carousel.isFirst}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#cbd5e1',
                opacity: carousel.isFirst && !loop ? 0.5 : 1
              }}
            >
              <Text style={{ fontWeight: '600', color: '#1e293b' }}>← Prev</Text>
            </TouchableOpacity>
          ) : <View />}

          {showDots && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {items.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => carousel.goTo(index)}
                  style={{
                    width: index === carousel.activeIndex ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === carousel.activeIndex ? '#2563eb' : '#cbd5e1',
                    marginHorizontal: 3
                  }}
                />
              ))}
            </View>
          )}

          {showArrows ? (
            <TouchableOpacity
              onPress={carousel.next}
              disabled={!loop && carousel.isLast}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#cbd5e1',
                opacity: carousel.isLast && !loop ? 0.5 : 1
              }}
            >
              <Text style={{ fontWeight: '600', color: '#1e293b' }}>Next →</Text>
            </TouchableOpacity>
          ) : <View />}
        </View>
      )}
    </View>
  );
}
