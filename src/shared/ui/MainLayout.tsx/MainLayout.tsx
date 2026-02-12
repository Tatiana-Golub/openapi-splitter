import UploadPanel from "../../../features/upload/UploadPanel";
import ViewPanel from "../ViewPanel/ViewPanel";
import styles from "./MainLayout.module.css"

function MainLayout() {
  return (
    <div className={styles.layout}>
      <UploadPanel />
      <ViewPanel />
    </div>
  );
}

export default MainLayout