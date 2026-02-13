import { describe, test, expect, vi, beforeEach } from 'vitest';
import { downloadZip } from './downloadZip';
import { saveAs } from 'file-saver';
import type { DirectoryNode } from '../../../entities/file-system/types';

const fileMock = vi.fn();
const generateAsyncMock = vi.fn().mockResolvedValue('mock-blob');

vi.mock('file-saver', () => ({
  saveAs: vi.fn()
}));

vi.mock('jszip', () => {
  return {
    default: class {
      file = fileMock;
      generateAsync = generateAsyncMock;
    }
  };
});

describe('downloadZip', () => {
  const tree: DirectoryNode = {
    type: 'directory',
    name: 'root',
    path: '',
    children: [
      {
        type: 'file',
        name: 'file1.yaml',
        path: 'file1.yaml',
        content: 'content1'
      },
      {
        type: 'directory',
        name: 'folder',
        path: 'folder',
        children: [
          {
            type: 'file',
            name: 'file2.yaml',
            path: 'folder/file2.yaml',
            content: 'content2'
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('adds all files to zip and calls saveAs', async () => {
    await downloadZip(tree);

    expect(fileMock).toHaveBeenCalledWith('file1.yaml', 'content1');
    expect(fileMock).toHaveBeenCalledWith('folder/file2.yaml', 'content2');

    expect(generateAsyncMock).toHaveBeenCalledWith({ type: 'blob' });

    expect(saveAs).toHaveBeenCalledWith('mock-blob', 'openapi-split.zip');
  });
});
