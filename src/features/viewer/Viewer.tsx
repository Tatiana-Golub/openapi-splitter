import styles from "./Viewer.module.css"

function Viewer() {
  return (
    <div className={styles.viewer}>
      <h2>File path</h2>
      <pre className="code">File content</pre>
    </div>
  );
}

export default Viewer