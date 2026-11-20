import { type RefObject, useEffect, useRef, useState } from 'react';

/** An element's measured content-box size. */
export type ElementSize = {
  /** The element's content-box width in pixels. */
  width: number;
  /** The element's content-box height in pixels. */
  height: number;
};

/** Options for the `useResizeObserver` hook. */
export type UseResizeObserverOptions<Target extends Element> = {
  /** Ref of the element to observe - one is created and returned when omitted. */
  ref?: RefObject<Target | null>;
  /** Whether to stop observing - skips creating a `ResizeObserver` while `true`. */
  disabled?: boolean;
};

/** Tracks the content-box size of the element in `ref`, read only on mount and when `ref` or `disabled` change. */
export const useResizeObserver = <Target extends Element = Element>({
  ref: externalRef,
  disabled = false,
}: UseResizeObserverOptions<Target> = {}) => {
  const internalRef = useRef<Target>(null);
  const ref = externalRef ?? internalRef;
  const [size, setSize] = useState<ElementSize | null>(null);

  useEffect(() => {
    if (disabled || !ref.current) {
      return;
    }

    const observer = new ResizeObserver(([{ contentRect }]) => {
      const { width, height } = contentRect;

      setSize({ width, height });
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      setSize(null);
    };
  }, [ref, disabled]);

  return { ref, size };
};
