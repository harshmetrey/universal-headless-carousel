import { CSSProperties } from 'react';
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

export interface WebContainerProps<T extends HTMLElement = HTMLElement> extends ContainerProps {
  ref: (node: T | null) => void;
  onScroll: (event: React.UIEvent<T>) => void;
  style?: CSSProperties;
}

export interface WebItemProps<T extends HTMLElement = HTMLElement> extends ItemProps {
  ref: (node: T | null) => void;
  style?: CSSProperties;
}

export interface UseWebCarouselReturn extends Omit<UseCarouselReturn, 'getContainerProps' | 'getItemProps'> {
  containerRef: <T extends HTMLElement = HTMLElement>(node: T | null) => void;
  getContainerProps: <T extends HTMLElement = HTMLElement>(customProps?: Partial<WebContainerProps<T>>) => WebContainerProps<T>;
  getItemProps: <T extends HTMLElement = HTMLElement>(index: number, customProps?: Partial<WebItemProps<T>>) => WebItemProps<T>;
  scrollTo: (index: number) => void;
}
