import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { FileSystemNode } from "../../../entities/file-system/types";
import { setSelectedFile } from "../../openapi-splitter/openApiSlice";
import styles from "./FileTreeNode.module.css"

type Props = {
  node: FileSystemNode;
  level: number;
};

export function FileTreeNode({ node, level }: Props) {
  const dispatch = useAppDispatch();
  const selectedPath = useAppSelector(
    state => state.openapi.selectedFilePath
  );

  const [isOpen, setIsOpen] = useState(true);

  const paddingLeft = level * 16;

  if (node.type === 'file') {
    const isSelected = node.path === selectedPath;

    return (
      <div
        className={`${styles.fileNode} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft }}
        onClick={() => dispatch(setSelectedFile(node.path))}
      >
        📄 {node.name}
      </div>
    );
  }

  return (
    <div>
      <div
        className={styles.folderNode}
        style={{ paddingLeft }}
        onClick={() => setIsOpen(v => !v)}
      >
        {isOpen ? '📂' : '📁'} {node.name}
      </div>

      {isOpen &&
        node.children.map(child => (
          <FileTreeNode
            key={child.path}
            node={child}
            level={level + 1}
          />
        ))}
    </div>
  );
}