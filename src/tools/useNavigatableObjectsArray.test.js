import { renderHook, act } from '@testing-library/react-hooks';
import useNavigatableObjectsArray from './useDynamoHistory';

describe('useNavigatableObjectsArray', () => {
  test('should initialize with the correct initial array and current index', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    expect(result.current.history).toEqual(initialArr);
    expect(result.current.currentIndex).toBe(1); // Initial index should be set to the index of the object with id 2
  });

  test('should return the correct current object', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    const currentObject = result.current.current();

    expect(currentObject).toEqual({ id: 2, name: 'Object 2', type: 'secondary' });
  });

  test('should return the correct next object', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    const nextObject = result.current.next();

    expect(nextObject).toEqual({ id: 3, name: 'Object 3', type: 'primary' });
  });

  test('should return the correct previous object', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    const previousObject = result.current.previous();

    expect(previousObject).toEqual({ id: 1, name: 'Object 1', type: 'primary' });
  });

  test('should go to the start correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    act(() => {
      result.current.goToStart();
    });

    expect(result.current.currentIndex).toBe(0); // Should set the current index to 0
    expect(result.current.current()).toEqual({ id: 1, name: 'Object 1', type: 'primary' });
  });

  test('should go to the end correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    act(() => {
      result.current.goToEnd();
    });

    expect(result.current.currentIndex).toBe(2); // Should set the current index to the last index
    expect(result.current.current()).toEqual({ id: 3, name: 'Object 3', type: 'primary' });
  });

  test('should go to the next object correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 1));

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentIndex).toBe(1); // Should move the current index to the next index
    expect(result.current.current()).toEqual({ id: 2, name: 'Object 2', type: 'secondary' });
  });

  test('should go to the previous object correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 3));

    act(() => {
      result.current.goBack();
    });

    expect(result.current.currentIndex).toBe(1); // Should move the current index to the previous index
    expect(result.current.current()).toEqual({ id: 2, name: 'Object 2', type: 'secondary' });
  });

  test('should go to the specified object correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 1));

    act(() => {
      result.current.goTo(3);
    });

    expect(result.current.currentIndex).toBe(2); // Should move the current index to the index of the specified object
    expect(result.current.current()).toEqual({ id: 3, name: 'Object 3', type: 'primary' });
  });

  test('should insert an object at the specified index correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    const newObject = { id: 3, name: 'Object 3', type: 'primary' };
    act(() => {
      result.current.insertObjectAtIndex(newObject, 1);
    });

    expect(result.current.history).toEqual([
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 3, name: 'Object 3', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
    ]);
    expect(result.current.currentIndex).toBe(1); // Should move the current index to the inserted object
    expect(result.current.current()).toEqual(newObject);
  });

  test('should insert an object at the end correctly when index is not specified', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    const newObject = { id: 3, name: 'Object 3', type: 'primary' };
    act(() => {
      result.current.insertObject(newObject);
    });

    expect(result.current.history).toEqual([
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ]);
    expect(result.current.currentIndex).toBe(2); // Should move the current index to the inserted object
    expect(result.current.current()).toEqual(newObject);
  });

  test('should update an object by id correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    const updatedObject = { id: 2, name: 'Updated Object 2', type: 'secondary' };
    act(() => {
      result.current.updateObjectById(updatedObject);
    });

    expect(result.current.history).toEqual([
      { id: 1, name: 'Object 1', type: 'primary' },
      updatedObject,
      { id: 3, name: 'Object 3', type: 'primary' },
    ]);
    expect(result.current.currentIndex).toBe(1); // Should keep the current index unchanged
    expect(result.current.current()).toEqual(updatedObject);
  });

  test('should remove the current object correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    const currentIndex = result.current.currentIndex;
    expect(result.current.currentIndex).toBe(1); // Should see correct the current index

    act(() => {
      result.current.removeAtIndex(currentIndex);
    });

    expect(result.current.history).toEqual([
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ]);
    // expect(result.current.currentIndex).toBe(1); // Should move the current index to the next index
    // expect(result.current.current()).toEqual({ id: 3, name: 'Object 3', type: 'primary' });
  });

  test('should remove an object at the specified index correctly', () => {
    const initialArr = [
      { id: 1, name: 'Object 1', type: 'primary' },
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ];

    const { result } = renderHook(() => useNavigatableObjectsArray(initialArr, 'id', 2));

    act(() => {
      result.current.removeAtIndex(0);
    });

    expect(result.current.history).toEqual([
      { id: 2, name: 'Object 2', type: 'secondary' },
      { id: 3, name: 'Object 3', type: 'primary' },
    ]);
    // expect(result.current.currentIndex).toBe(0); // Should keep the current index unchanged
    // expect(result.current.current()).toEqual({ id: 2, name: 'Object 2', type: 'secondary' });
  });
});
