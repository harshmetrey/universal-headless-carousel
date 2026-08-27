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
   * Show navigation arrows (Prev/Next).
   * @default true
   */
  showArrows?: boolean;
  /**
   * Show pagination dots indicator.
   * @default true
   */
  showDots?: boolean;
  /**
   * Custom root wrapper class name.
   */
  className?: string;
  /**
   * Custom root wrapper inline styles.
   */
  style?: CSSProperties;
}

export function Carousel({
  items = [],
  children,
  renderItem,
  showArrows = true,
  showDots = true,
  snapAlign = 'center',
  loop = false,
  autoplay = 0,
  startIndex = 0,
  style,
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

  return (
    <div className={`uhc-carousel-root ${className}`.trim()} style={{ position: 'relative', width: '100%', ...style }}>
      <div {...carousel.getContainerProps()}>
        {items.length > 0
          ? items.map((item, index) => (
              <div key={index} {...carousel.getItemProps(index)}>
                {renderItem ? renderItem(item, index, carousel.activeIndex) : item}
              </div>
            ))
          : childrenArray.map((child, index) => (
              <div key={index} {...carousel.getItemProps(index)}>
                {child}
              </div>
            ))}
      </div>

      {(showArrows || showDots) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          {showArrows ? (
            <button
              type="button"
              onClick={carousel.prev}
              disabled={!loop && carousel.isFirst}
              aria-label="Previous Slide"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 600,
                cursor: carousel.isFirst && !loop ? 'not-allowed' : 'pointer',
                opacity: carousel.isFirst && !loop ? 0.5 : 1
              }}
            >
              ← Prev
            </button>
          ) : <div />}

          {showDots && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {Array.from({ length: itemsCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => carousel.goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  style={{
                    width: index === carousel.activeIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: index === carousel.activeIndex ? '#2563eb' : '#cbd5e1',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}

          {showArrows ? (
            <button
              type="button"
              onClick={carousel.next}
              disabled={!loop && carousel.isLast}
              aria-label="Next Slide"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 600,
                cursor: carousel.isLast && !loop ? 'not-allowed' : 'pointer',
                opacity: carousel.isLast && !loop ? 0.5 : 1
              }}
            >
              Next →
            </button>
          ) : <div />}
        </div>
      )}
    </div>
  );
}
