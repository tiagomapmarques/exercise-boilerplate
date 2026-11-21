import { act, renderHook } from '@/testing';

import { useOverridableState } from './use-overridable-state';

describe(useOverridableState, () => {
  const toState = (external: string) => external.toUpperCase();

  it('derives its initial state from external', () => {
    const { result } = renderHook(useOverridableState<string, string>, {
      initialProps: { external: 'a', toState },
    });

    expect(result.current[0]).toBe('A');
  });

  it('updates state immediately when the setter is called', () => {
    const { result } = renderHook(useOverridableState<string, string>, {
      initialProps: { external: 'a', toState },
    });

    expect(result.current[0]).toBe('A');

    act(() => result.current[1]('CHANGED'));

    expect(result.current[0]).toBe('CHANGED');
  });

  it('calls onChange with the new state when the setter is called', () => {
    const onChange = vi.fn();
    const { result } = renderHook(useOverridableState<string, string>, {
      initialProps: { external: 'a', toState, onChange },
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => result.current[1]('CHANGED'));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('CHANGED');
  });

  it('does not require onChange to be provided', () => {
    const { result } = renderHook(useOverridableState<string, string>, {
      initialProps: { external: 'a', toState },
    });

    expect(() => act(() => result.current[1]('CHANGED'))).not.toThrow();
  });

  it('keeps the setter stable across renders', () => {
    const { result, rerender } = renderHook(
      useOverridableState<string, string>,
      { initialProps: { external: 'a', toState, onChange: vi.fn() } },
    );

    const [, setter] = result.current;

    rerender({ external: 'b', toState, onChange: vi.fn() });

    expect(result.current[1]).toBe(setter);
  });

  it('calls the latest onChange, even through a setter from an earlier render', () => {
    const firstOnChange = vi.fn();
    const latestOnChange = vi.fn();
    const { result, rerender } = renderHook(
      useOverridableState<string, string>,
      { initialProps: { external: 'a', toState, onChange: firstOnChange } },
    );

    const [, setter] = result.current;

    rerender({ external: 'a', toState, onChange: latestOnChange });

    expect(latestOnChange).not.toHaveBeenCalled();

    act(() => setter('CHANGED'));

    expect(firstOnChange).not.toHaveBeenCalled();
    expect(latestOnChange).toHaveBeenCalledExactlyOnceWith('CHANGED');
  });

  describe('re-rendering with the same external value', () => {
    it('keeps a locally set state', () => {
      const { result, rerender } = renderHook(
        useOverridableState<string, string>,
        { initialProps: { external: 'a', toState } },
      );

      act(() => result.current[1]('CHANGED'));

      expect(result.current[0]).toBe('CHANGED');

      rerender({ external: 'a', toState });

      expect(result.current[0]).toBe('CHANGED');
    });

    it('does not call toState again', () => {
      const trackedToState = vi.fn(toState);
      const { rerender } = renderHook(useOverridableState<string, string>, {
        initialProps: { external: 'a', toState: trackedToState },
      });

      expect(trackedToState).toHaveBeenCalledExactlyOnceWith('a');

      rerender({ external: 'a', toState: trackedToState });

      expect(trackedToState).toHaveBeenCalledExactlyOnceWith('a');
    });
  });

  describe('re-rendering with a new external value', () => {
    it('resets state to the newly derived value, discarding a locally set state', () => {
      const { result, rerender } = renderHook(
        useOverridableState<string, string>,
        { initialProps: { external: 'a', toState } },
      );

      act(() => result.current[1]('CHANGED'));

      expect(result.current[0]).toBe('CHANGED');

      rerender({ external: 'b', toState });

      expect(result.current[0]).toBe('B');
    });

    it('does not call onChange', () => {
      const onChange = vi.fn();
      const { rerender } = renderHook(useOverridableState<string, string>, {
        initialProps: { external: 'a', toState, onChange },
      });

      expect(onChange).not.toHaveBeenCalled();

      rerender({ external: 'b', toState, onChange });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('resets even when the new external value is deeply equal to the previous one', () => {
      const toArrayState = (external: string[]) => external.join(',');

      const { result, rerender } = renderHook(
        useOverridableState<string[], string>,
        {
          initialProps: { external: ['a'], toState: toArrayState },
        },
      );

      act(() => result.current[1]('CHANGED'));

      expect(result.current[0]).toBe('CHANGED');

      rerender({ external: ['a'], toState: toArrayState });

      expect(result.current[0]).toBe('a');
    });
  });
});
