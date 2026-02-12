import FileTree from "../../../features/file-tree/FileTree/FileTree";
import Viewer from "../../../features/viewer/Viewer";
import styles from "./ViewPanel.module.css"

function ViewPanel() {
  return (
    <div className={styles.viewPanel}>
      <FileTree />
      <Viewer />
    </div>
  );
}

export default ViewPanel