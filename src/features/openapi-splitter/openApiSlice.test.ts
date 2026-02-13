import { describe, test, expect } from 'vitest';
import reducer, {
  setTree,
  setError,
  clearError,
  setSelectedFile,
  resetState,
  type OpenApiState
} from './openApiSlice';
import type { DirectoryNode } from '../../entities/file-system/types';

describe('openApiSlice reducer', () => {
  const initialState: OpenApiState = {
    tree: null,
    selectedFilePath: null,
    error: null
  };

  const mockTree: DirectoryNode = {
    type: 'directory',
    name: 'root',
    path: '',
    children: []
  };

  test('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  test('setTree sets tree and resets error and selectedFilePath', () => {
    const prevState: OpenApiState = {
      tree: null,
      selectedFilePath: 'file.yaml',
      error: 'some error'
    };

    const state = reducer(prevState, setTree(mockTree));

    expect(state.tree).toEqual(mockTree);
    expect(state.selectedFilePath).toBeNull();
    expect(state.error).toBeNull();
  });

  test('setError sets error and clears tree and selectedFilePath', () => {
    const prevState: OpenApiState = {
      tree: mockTree,
      selectedFilePath: 'file.yaml',
      error: null
    };

    const state = reducer(prevState, setError('Invalid OpenAPI'));

    expect(state.error).toBe('Invalid OpenAPI');
    expect(state.tree).toBeNull();
    expect(state.selectedFilePath).toBeNull();
  });

  test('clearError sets error to null', () => {
    const prevState: OpenApiState = {
      tree: null,
      selectedFilePath: null,
      error: 'Some error'
    };

    const state = reducer(prevState, clearError());

    expect(state.error).toBeNull();
  });

  test('resetState resets everything to initial state', () => {
    const prevState: OpenApiState = {
      tree: mockTree,
      selectedFilePath: 'file.yaml',
      error: 'error'
    };

    const state = reducer(prevState, resetState());

    expect(state).toEqual(initialState);
  });

  test('setSelectedFile sets selectedFilePath only', () => {
    const state = reducer(initialState, setSelectedFile('test.yaml'));

    expect(state.selectedFilePath).toBe('test.yaml');
    expect(state.tree).toBeNull();
    expect(state.error).toBeNull();
  });
});
