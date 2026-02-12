import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../shared/ui/Button/Button";
import styles from "./UploadPanel.module.css"
import { resetState, setError, setTree } from "../openapi-splitter/openapiSlice";
import { splitOpenApi } from "../openapi-splitter/splitOpenApi";

function UploadPanel() {
  const dispatch = useAppDispatch();
  const error = useAppSelector(state => state.openapi.error);

  const [text, setText] = useState('');

  const handleParse = () => {
    if (!text.trim()) {
      dispatch(setError('File is empty'));
      return;
    }

    try {
      const tree = splitOpenApi(text);
      dispatch(setTree(tree));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setError('Unknown parsing error'));
      }
    }
  };


  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        dispatch(resetState());
        setText(result);
      }
    };

    reader.onerror = () => {
      dispatch(setError('Failed to read file'));
    };

    reader.readAsText(file);
  };

  return (
    <section className={styles.upload}>
      <h2>OpenAPI input</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your openapi.yaml here"
        rows={10}
      />

      <div className={styles.uploadActions}>
        <label className={styles.fileButton}>
          Upload file
          <input
            type="file"
            accept=".yaml,.yml"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
          />
        </label>

        {error && (
          <div className={styles.uploadError}>
            {error}
          </div>
        )}

        <Button onClick={handleParse}>
          Parse
        </Button>
      </div>
    </section>
  );
}

export default UploadPanel
