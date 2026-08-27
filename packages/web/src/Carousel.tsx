import React, { ReactNode, CSSProperties } from 'react';
import { useWebCarousel } from './useWebCarousel';
import { UseWebCarouselOptions } from './types';

export interface CarouselProps extends Omit<UseWebCarouselOptions, 'itemsCount'> {
  /**
   * Array of slide items to render.
   */
  items?: ReactNode[];
  /**
   * Slide children elements.
   */
  children?: ReactNode;
  /**
   * Custom render function for each slide.
   */
  renderItem?: (item: ReactNode, index: number, activeIndex: number) => ReactNode;
  /**
   * Custom width for each slide card (e.g. 300, '80%', '300px').
   */
  cardWidth?: number | string;
  /**
   * Custom height for each slide card (e.g. 200, '200px').
   */
  cardHeight?: number | string;
  /**
   * Show navigation arrows (Prev/Next).
   * @default true
   */
  showArrows?: boolean;
  /**
   * Custom previous arrow element or render function.
   */
  prevArrow?: ReactNode | ((props: { onClick: () => void; disabled: boolean }) => ReactNode);
  /**
   * Custom next arrow element or render function.
   */
  nextArrow?: ReactNode | ((props: { onClick: () => void; disabled: boolean }) => ReactNode);
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
   * Custom root wrapper class name.
   */
  className?: string;
  /**
   * Custom root wrapper inline styles.
   */
  style?: CSSProperties;
  /**
   * Custom slide card container styles.
   */
  cardStyle?: CSSProperties;
}

export function Carousel({
  items = [],
  children,
  renderItem,
  cardWidth,
  cardHeight,
  showArrows = true,
  prevArrow,
  nextArrow,
  showDots = true,
  customDot,
  snapAlign = 'center',
  loop = false,
  autoplay = 0,
  startIndex = 0,
  style,
  cardStyle,
  className = '',
  ...restOptions
}: CarouselProps) {
  const childrenArray = React.Children.toArray(children);
  const itemsCount = items.length || childrenArray.length;

  const carousel = useWebCarousel({
    itemsCount,
    snapAlign,
    loop,
    autoplay,
    startIndex,
    ...restOptions
  });

  const parsedCardWidth = typeof cardWidth === 'number' ? `${cardWidth}px` : cardWidth;
  const parsedCardHeight = typeof cardHeight === 'number' ? `${cardHeight}px` : cardHeight;

  const mergedItemStyle: CSSProperties = {
    ...(parsedCardWidth ? { width: parsedCardWidth } : {}),
    ...(parsedCardHeight ? { height: parsedCardHeight } : {}),
    ...cardStyle
  };

  const renderPrevArrow = () => {
    const disabled = !loop && carousel.isFirst;
    if (typeof prevArrow === 'function') {
      return prevArrow({ onClick: carousel.prev, disabled });
    }
    if (prevArrow) {
      return (
        <span onClick={disabled ? undefined : carousel.prev} style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
          {prevArrow}
        </span>
      );
    }
    return (
      <button
        type="button"
        onClick={carousel.prev}
        disabled={disabled}
        aria-label="Previous Slide"
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          color: '#1e293b',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1
        }}
      >
        ← Prev
      </button>
    );
  };

  const renderNextArrow = () => {
    const disabled = !loop && carousel.isLast;
    if (typeof nextArrow === 'function') {
      return nextArrow({ onClick: carousel.next, disabled });
    }
    if (nextArrow) {
      return (
        <span onClick={disabled ? undefined : carousel.next} style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
          {nextArrow}
        </span>
      );
    }
    return (
      <button
        type="button"
        onClick={carousel.next}
        disabled={disabled}
        aria-label="Next Slide"
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          color: '#1e293b',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1
        }}
      >
        Next →
      </button>
    );
  };

  return (
    <div className={`uhc-carousel-root ${className}`.trim()} style={{ position: 'relative', width: '100%', ...style }}>
      <div {...carousel.getContainerProps()}>
        {items.length > 0
          ? items.map((item, index) => (
              <div key={index} {...carousel.getItemProps(index, { style: mergedItemStyle })}>
                {renderItem ? renderItem(item, index, carousel.activeIndex) : item}
              </div>
            ))
          : childrenArray.map((child, index) => (
              <div key={index} {...carousel.getItemProps(index, { style: mergedItemStyle })}>
                {child}
              </div>
            ))}
      </div>

      {(showArrows || showDots) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          {showArrows ? renderPrevArrow() : <div />}

          {showDots && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {Array.from({ length: itemsCount }).map((_, index) => {
                const isActive = index === carousel.activeIndex;
                if (customDot) {
                  return (
                    <span key={index} onClick={() => carousel.goTo(index)} style={{ cursor: 'pointer' }}>
                      {customDot(index, isActive)}
                    </span>
                  );
                }
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => carousel.goTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    style={{
                      width: isActive ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? '#2563eb' : '#cbd5e1',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                );
              })}
            </div>
          )}

          {showArrows ? renderNextArrow() : <div />}
        </div>
      )}
    </div>
  );
}
