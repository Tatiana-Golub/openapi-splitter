import { useAppSelector } from "../../../app/hooks";
import Button from "../../../shared/ui/Button/Button";
import { downloadZip } from "../../openapi-splitter/lib/downloadZip";
import { FileTreeNode } from "../FileTreeNode/FileTreeNode";
import styles from "./FileTree.module.css"

function FileTree() {
  const tree = useAppSelector(state => state.openapi.tree);

  if (!tree) {
    return (
      <section className={styles.fileTree}>
        <h2>File Tree</h2>
        <div className="file-tree-empty">
          No files yet
        </div>
      </section>
    );
  }

  return (
    <section className={styles.fileTree}>
      <Button onClick={() => tree && downloadZip(tree)}>
        Download ZIP
      </Button>
      <h2>File tree</h2>
      <FileTreeNode node={tree} level={0} />
    </section>
  );
}

export default FileTree