import type { DirectoryNode, FileNode } from "./types";

export function findFileByPath(
  node: DirectoryNode,
  path: string
): FileNode | null {
  for (const child of node.children) {
    if (child.type === 'file' && child.path === path) {
      return child;
    }

    if (child.type === 'directory') {
      const found = findFileByPath(child, path);
      if (found) return found;
    }
  }

  return null;
}