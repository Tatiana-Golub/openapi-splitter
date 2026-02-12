export type FileNode = {
  type: 'file';
  name: string;
  path: string;
  content: string;
};

export type DirectoryNode = {
  type: 'directory';
  name: string;
  path: string;
  children: Array<FileNode | DirectoryNode>;
};

export type FileSystemNode = FileNode | DirectoryNode;