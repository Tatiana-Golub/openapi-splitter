import { useAppSelector } from '../../app/hooks';
import { findFileByPath } from '../../entities/file-system/findFileByPath';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './Viewer.module.css';

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
    <section className={styles.viewer}>
      <h2>{file.path}</h2>
      <SyntaxHighlighter
        language="yaml"
        style={oneDark}
        showLineNumbers
      >
        {file.content}
      </SyntaxHighlighter>
    </section>
  );
}

export default Viewer