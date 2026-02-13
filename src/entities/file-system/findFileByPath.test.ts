import { describe, test, expect } from 'vitest';
import { findFileByPath } from './findFileByPath';
import type { DirectoryNode } from './types';

describe('findFileByPath', () => {
  const tree: DirectoryNode = {
    type: 'directory',
    name: 'root',
    path: '',
    children: [
      {
        type: 'file',
        name: 'rootFile.yaml',
        path: 'rootFile.yaml',
        content: 'root content'
      },
      {
        type: 'directory',
        name: 'folder',
        path: 'folder',
        children: [
          {
            type: 'file',
            name: 'nested.yaml',
            path: 'folder/nested.yaml',
            content: 'nested content'
          },
          {
            type: 'directory',
            name: 'deep',
            path: 'folder/deep',
            children: [
              {
                type: 'file',
                name: 'deepFile.yaml',
                path: 'folder/deep/deepFile.yaml',
                content: 'deep content'
              }
            ]
          }
        ]
      }
    ]
  };

  test('returns file from root level', () => {
    const result = findFileByPath(tree, 'rootFile.yaml');

    expect(result).not.toBeNull();
    expect(result?.name).toBe('rootFile.yaml');
  });

  test('returns file from nested directory', () => {
    const result = findFileByPath(tree, 'folder/nested.yaml');

    expect(result).not.toBeNull();
    expect(result?.content).toBe('nested content');
  });

  test('returns file from deep nested directory', () => {
    const result = findFileByPath(tree, 'folder/deep/deepFile.yaml');

    expect(result).not.toBeNull();
    expect(result?.name).toBe('deepFile.yaml');
  });

  test('returns null when file does not exist', () => {
    const result = findFileByPath(tree, 'not-found.yaml');

    expect(result).toBeNull();
  });

  test('returns null when tree has no children', () => {
    const emptyTree: DirectoryNode = {
      type: 'directory',
      name: 'root',
      path: '',
      children: []
    };

    const result = findFileByPath(emptyTree, 'any.yaml');

    expect(result).toBeNull();
  });
});
