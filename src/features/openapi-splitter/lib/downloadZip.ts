import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { DirectoryNode, FileSystemNode } from '../../../entities/file-system/types';

function addToZip(zip: JSZip, node: FileSystemNode) {
  if (node.type === 'file') {
    zip.file(node.path, node.content);
    return;
  }

  node.children.forEach(child => addToZip(zip, child));
}

export async function downloadZip(tree: DirectoryNode) {
  const zip = new JSZip();

  addToZip(zip, tree);

  const blob = await zip.generateAsync({ type: 'blob' });

  saveAs(blob, 'openapi-split.zip');
}