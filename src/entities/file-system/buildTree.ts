import type { DirectoryNode, FileNode } from './types';

type VirtualFile = {
  path: string;
  content: string;
};

export function buildTree(files: VirtualFile[]): DirectoryNode {
  const root: DirectoryNode = {
    type: 'directory',
    name: 'root',
    path: '',
    children: []
  };

  files.forEach(file => {
    const parts = file.path.split('/');
    insertNode(root, parts, file.content);
  });

  return root;
}

function insertNode(
  current: DirectoryNode,
  parts: string[],
  content: string
) {
  const [head, ...rest] = parts;

  if (!head) return;

  if (rest.length === 0) {
    const fileNode: FileNode = {
      type: 'file',
      name: head,
      path: buildPath(current.path, head),
      content
    };

    current.children.push(fileNode);
    return;
  }

  let dir = current.children.find(
    child =>
      child.type === 'directory' && child.name === head
  ) as DirectoryNode | undefined;

  if (!dir) {
    dir = {
      type: 'directory',
      name: head,
      path: buildPath(current.path, head),
      children: []
    };

    current.children.push(dir);
  }

  insertNode(dir, rest, content);
}

function buildPath(parent: string, name: string) {
  return parent ? `${parent}/${name}` : name;
}