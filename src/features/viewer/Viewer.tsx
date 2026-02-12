import { useAppSelector } from "../../app/hooks";
import { findFileByPath } from "../../entities/file-system/findFileByPath";
import styles from "./Viewer.module.css"

function Viewer() {
  const tree = useAppSelector(state => state.openapi.tree);
  const selectedPath = useAppSelector(
    state => state.openapi.selectedFilePath
  );

  if (!tree || !selectedPath) {
    return <div className={styles.viewerEmpty}>Select a file to preview</div>;
  }

  const file = findFileByPath(tree, selectedPath);

  if (!file) {
    return <div className={styles.viewerError}>File not found</div>;
  }

  return (
    <div className="viewer">
      <h2>{file.path}</h2>
      <pre>{file.content}</pre>
    </div>
  );
}

export default Viewer