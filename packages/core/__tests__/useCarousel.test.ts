import { renderHook, act } from '@testing-library/react';
import { useCarousel } from '../src/useCarousel';

describe('useCarousel Core Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with default options', () => {
    const { result } = renderHook(() => useCarousel({ itemsCount: 5 }));

    expect(result.current.activeIndex).toBe(0);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
    expect(result.current.isPlaying).toBe(false);
  });

  test('initializes with startIndex', () => {
    const { result } = renderHook(() => useCarousel({ itemsCount: 5, startIndex: 2 }));

    expect(result.current.activeIndex).toBe(2);
    expect(result.current.isFirst).toBe(false);
    expect(result.current.isLast).toBe(false);
  });

  test('non-looping next() and prev() navigation', () => {
    const { result } = renderHook(() => useCarousel({ itemsCount: 3, loop: false }));

    act(() => {
      result.current.next();
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.next();
    });
    expect(result.current.activeIndex).toBe(2);
    expect(result.current.isLast).toBe(true);

    // Boundary check: next at last item does not overflow
    act(() => {
      result.current.next();
    });
    expect(result.current.activeIndex).toBe(2);

    act(() => {
      result.current.prev();
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.prev();
    });
    expect(result.current.activeIndex).toBe(0);

    // Boundary check: prev at first item does not underflow
    act(() => {
      result.current.prev();
    });
    expect(result.current.activeIndex).toBe(0);
  });

  test('looping next() and prev() navigation', () => {
    const { result } = renderHook(() => useCarousel({ itemsCount: 3, loop: true }));

    act(() => {
      result.current.prev();
    });
    expect(result.current.activeIndex).toBe(2);

    act(() => {
      result.current.next();
    });
    expect(result.current.activeIndex).toBe(0);
  });

  test('goTo() index bounds handling', () => {
    const { result } = renderHook(() => useCarousel({ itemsCount: 4, loop: false }));

    act(() => {
      result.current.goTo(3);
    });
    expect(result.current.activeIndex).toBe(3);

    // Clamp out-of-bounds high index
    act(() => {
      result.current.goTo(10);
    });
    expect(result.current.activeIndex).toBe(3);

    // Clamp out-of-bounds low index
    act(() => {
      result.current.goTo(-5);
    });
    expect(result.current.activeIndex).toBe(0);
  });

  test('autoplay timer execution and controls', () => {
    const { result } = renderHook(() =>
      useCarousel({ itemsCount: 3, autoplay: 2000, loop: true })
    );

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.activeIndex).toBe(2);

    act(() => {
      result.current.pause();
    });
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.activeIndex).toBe(2); // didn't advance

    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.activeIndex).toBe(0); // wrapped around
  });

  test('getContainerProps accessibility and keyboard navigation', () => {
    const { result } = renderHook(() => useCarousel({ itemsCount: 5 }));

    const containerProps = result.current.getContainerProps();
    expect(containerProps.role).toBe('region');
    expect(containerProps['aria-roledescription']).toBe('carousel');
    expect(containerProps.tabIndex).toBe(0);

    // ArrowRight keydown
    const preventDefault = jest.fn();
    act(() => {
      containerProps.onKeyDown({ key: 'ArrowRight', preventDefault } as any);
    });
    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.activeIndex).toBe(1);

    // End keydown
    act(() => {
      containerProps.onKeyDown({ key: 'End', preventDefault } as any);
    });
    expect(result.current.activeIndex).toBe(4);

    // Home keydown
    act(() => {
      containerProps.onKeyDown({ key: 'Home', preventDefault } as any);
    });
    expect(result.current.activeIndex).toBe(0);

    // ArrowLeft keydown
    act(() => {
      result.current.goTo(2);
    });
    act(() => {
      containerProps.onKeyDown({ key: 'ArrowLeft', preventDefault } as any);
    });
    expect(result.current.activeIndex).toBe(1);
  });

  test('getItemProps accessibility attributes', () => {
    const { result } = renderHook(() => useCarousel({ itemsCount: 3, startIndex: 1 }));

    const item0Props = result.current.getItemProps(0);
    expect(item0Props.role).toBe('group');
    expect(item0Props['aria-roledescription']).toBe('slide');
    expect(item0Props['aria-label']).toBe('Slide 1 of 3');
    expect(item0Props['aria-hidden']).toBe(true);
    expect(item0Props['data-active']).toBe(false);

    const item1Props = result.current.getItemProps(1);
    expect(item1Props['aria-hidden']).toBe(false);
    expect(item1Props['data-active']).toBe(true);
  });
});
