import { HTMLAttributes, KeyboardEvent, MouseEvent } from 'react';

export interface UseCarouselOptions {
  /**
   * Total number of items in the carousel.
   */
  itemsCount: number;
  /**
   * Whether navigation should loop around when reaching the ends.
   * @default false
   */
  loop?: boolean;
  /**
   * Autoplay interval in milliseconds. If true, defaults to 3000ms. If false or 0, autoplay is disabled.
   * @default 0
   */
  autoplay?: number | boolean;
  /**
   * Initial active index.
   * @default 0
   */
  startIndex?: number;
  /**
   * Accessible label for the carousel region.
   * @default "Carousel"
   */
  ariaLabel?: string;
}

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  role: string;
  'aria-roledescription': string;
  'aria-label': string;
  tabIndex: number;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onMouseEnter: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave: (event: MouseEvent<HTMLElement>) => void;
}

export interface ItemProps extends HTMLAttributes<HTMLElement> {
  role: string;
  'aria-roledescription': string;
  'aria-label': string;
  'aria-hidden': boolean;
  'data-index': number;
  'data-active': boolean;
}

export interface UseCarouselReturn {
  activeIndex: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  getContainerProps: (customProps?: Partial<ContainerProps>) => ContainerProps;
  getItemProps: (index: number, customProps?: Partial<ItemProps>) => ItemProps;
}
