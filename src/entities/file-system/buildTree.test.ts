import { describe, test, expect } from 'vitest';
import { buildTree } from './buildTree';
import type { DirectoryNode } from './types';

describe('buildTree', () => {
  test('creates empty root when no files provided', () => {
    const tree = buildTree([]);

    expect(tree).toEqual({
      type: 'directory',
      name: 'root',
      path: '',
      children: []
    });
  });

  test('adds single file to root', () => {
    const tree = buildTree([
      { path: 'file1.yaml', content: 'content1' }
    ]);

    expect(tree.children).toHaveLength(1);

    const file = tree.children[0];
    expect(file).toEqual({
      type: 'file',
      name: 'file1.yaml',
      path: 'file1.yaml',
      content: 'content1'
    });
  });

  test('creates nested directories', () => {
    const tree = buildTree([
      { path: 'folder/file.yaml', content: 'content' }
    ]);

    expect(tree.children).toHaveLength(1);

    const folder = tree.children[0] as DirectoryNode;
    expect(folder.type).toBe('directory');
    expect(folder.name).toBe('folder');
    expect(folder.path).toBe('folder');

    expect(folder.children).toHaveLength(1);

    const file = folder.children[0];
    expect(file).toEqual({
      type: 'file',
      name: 'file.yaml',
      path: 'folder/file.yaml',
      content: 'content'
    });
  });

  test('creates deep nested structure', () => {
    const tree = buildTree([
      { path: 'a/b/c/file.yaml', content: 'deep' }
    ]);

    const a = tree.children[0] as DirectoryNode;
    const b = a.children[0] as DirectoryNode;
    const c = b.children[0] as DirectoryNode;
    const file = c.children[0];

    expect(file.path).toBe('a/b/c/file.yaml');
    expect(file.type).toBe('file');
  });

  test('adds multiple files in same directory', () => {
    const tree = buildTree([
      { path: 'folder/file1.yaml', content: 'c1' },
      { path: 'folder/file2.yaml', content: 'c2' }
    ]);

    const folder = tree.children[0] as DirectoryNode;

    expect(folder.children).toHaveLength(2);

    const names = folder.children.map(child => child.name);
    expect(names).toContain('file1.yaml');
    expect(names).toContain('file2.yaml');
  });

  test('adds files to different branches', () => {
    const tree = buildTree([
      { path: 'a/file1.yaml', content: 'c1' },
      { path: 'b/file2.yaml', content: 'c2' }
    ]);

    expect(tree.children).toHaveLength(2);

    const names = tree.children.map(child => child.name);
    expect(names).toContain('a');
    expect(names).toContain('b');
  });
});
