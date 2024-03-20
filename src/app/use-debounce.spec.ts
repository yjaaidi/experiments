import { useDebounce } from './use-debounce';
import { act, renderHook } from '@testing-library/react';

vi.useFakeTimers();

describe(useDebounce.name, () => {
  test('should return undefined value initially', () => {
    const { result } = renderHook(() => useDebounce({ delay: 1000 }));

    act(() => {
      result.current.setValue('my value');
      vi.advanceTimersByTime(999);
    });

    expect(result.current.value).toBeUndefined();
  });

  test('should return the value on debounce', async () => {
    const { result } = renderHook(() => useDebounce({ delay: 1000 }));

    act(() => {
      result.current.setValue('my value');
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.value).toBe('my value');
  });

  test('should call onChange on debounce', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDebounce({ onChange }));

    act(() => {
      result.current.setValue('my value');
      vi.runAllTimers();
    });

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('my value');
  });

  test('should return the value on commit', async () => {
    const { result } = renderHook(() => useDebounce());

    act(() => {
      result.current.setValue('my value');
      result.current.commit();
    });

    expect(result.current.value).toBe('my value');
  });

  test('should call onChange on commit', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDebounce({ onChange }));

    act(() => {
      result.current.setValue('my value');
      result.current.commit();
    });

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('my value');
  });

  test('should call onChange on commit once even after debounce time', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDebounce({ onChange }));

    act(() => {
      result.current.setValue('my value');
      result.current.commit();
      vi.runAllTimers();
    });

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('my value');
  });
});
