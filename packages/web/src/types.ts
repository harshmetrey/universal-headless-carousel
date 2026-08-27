import { CSSProperties, RefCallback } from 'react';
import { UseCarouselOptions, UseCarouselReturn, ContainerProps, ItemProps } from 'universal-headless-carousel-core';

export interface UseWebCarouselOptions extends UseCarouselOptions {
  /**
   * Scroll snap align mode.
   * @default 'center'
   */
  snapAlign?: 'start' | 'center' | 'end';
  /**
   * Scroll behavior for programmatic scrolling.
   * @default 'smooth'
   */
  scrollBehavior?: ScrollBehavior;
  /**
   * Hide scrollbar visually via CSS styles.
   * @default true
   */
  hideScrollbar?: boolean;
}

export interface WebContainerProps extends ContainerProps {
  ref: RefCallback<HTMLElement>;
  onScroll: (event: React.UIEvent<HTMLElement>) => void;
  style?: CSSProperties;
}

export interface WebItemProps extends ItemProps {
  ref: RefCallback<HTMLElement>;
  style?: CSSProperties;
}

export interface UseWebCarouselReturn extends Omit<UseCarouselReturn, 'getContainerProps' | 'getItemProps'> {
  containerRef: (node: HTMLElement | null) => void;
  getContainerProps: (customProps?: Partial<WebContainerProps>) => WebContainerProps;
  getItemProps: (index: number, customProps?: Partial<WebItemProps>) => WebItemProps;
  scrollTo: (index: number) => void;
}
