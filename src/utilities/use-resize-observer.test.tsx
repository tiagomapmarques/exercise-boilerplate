import { createRef, useRef } from 'react';
import { Box } from '@mantine/core';

import { render, renderHook, screen, waitForTimeout } from '@/testing';

import { useResizeObserver } from './use-resize-observer';

describe(useResizeObserver, () => {
  const Observed = ({
    width,
    disabled,
  }: {
    width: number;
    disabled?: boolean;
  }) => {
    const { ref, size } = useResizeObserver<HTMLDivElement>({ disabled });

    return (
      <Box ref={ref} w={width} h={50}>
        {size ? `${size.width} x ${size.height}` : 'Not measured'}
      </Box>
    );
  };

  it('reports nothing while no element is attached', async () => {
    const { result } = renderHook(useResizeObserver<HTMLDivElement>);

    await waitForTimeout(100);

    expect(result.current.size).toBeNull();
  });

  it('reports the size of the element once measured', async () => {
    render(<Observed width={100} />);

    expect(screen.getByText('Not measured')).toBeVisible();

    expect(await screen.findByText('100 x 50')).toBeVisible();
  });

  it('updates the size when the element resizes', async () => {
    const { rerender } = render(<Observed width={100} />);

    expect(await screen.findByText('100 x 50')).toBeVisible();

    rerender(<Observed width={200} />);

    expect(await screen.findByText('200 x 50')).toBeVisible();
  });

  it('disconnects the observer once the element is removed', () => {
    const disconnect = vi.fn();
    class TrackedResizeObserver extends ResizeObserver {
      public disconnect() {
        disconnect();
        super.disconnect();
      }
    }
    vi.stubGlobal('ResizeObserver', TrackedResizeObserver);

    const { unmount } = render(<Observed width={100} />);

    expect(disconnect).not.toHaveBeenCalled();

    unmount();

    expect(disconnect).toHaveBeenCalledExactlyOnceWith();
  });

  it('reports nothing again once disabled', async () => {
    const { rerender } = render(<Observed width={100} />);

    expect(await screen.findByText('100 x 50')).toBeVisible();

    rerender(<Observed width={100} disabled />);

    expect(screen.getByText('Not measured')).toBeVisible();
  });

  describe('disabled', () => {
    it('does not observe the element', async () => {
      render(<Observed width={100} disabled />);

      await waitForTimeout(100);

      expect(screen.getByText('Not measured')).toBeVisible();
    });

    it('starts observing once no longer disabled', async () => {
      const { rerender } = render(<Observed width={100} disabled />);

      expect(screen.getByText('Not measured')).toBeVisible();

      rerender(<Observed width={100} />);

      expect(await screen.findByText('100 x 50')).toBeVisible();
    });
  });

  describe('a ref is given', () => {
    const ObservedThroughOwnRef = ({ width }: { width: number }) => {
      const ref = useRef<HTMLDivElement>(null);
      const { size } = useResizeObserver({ ref });

      return (
        <Box ref={ref} w={width} h={50}>
          {size ? `${size.width} x ${size.height}` : 'Not measured'}
        </Box>
      );
    };

    it('returns the given ref', () => {
      const ref = createRef<HTMLDivElement>();

      const { result } = renderHook(useResizeObserver<HTMLDivElement>, {
        initialProps: { ref },
      });

      expect(result.current.ref).toBe(ref);
    });

    it('observes the element attached to the given ref', async () => {
      render(<ObservedThroughOwnRef width={100} />);

      expect(screen.getByText('Not measured')).toBeVisible();

      expect(await screen.findByText('100 x 50')).toBeVisible();
    });
  });
});
