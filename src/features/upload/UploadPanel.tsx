import Button from "../../shared/ui/Button/Button";
import styles from "./UploadPanel.module.css"

function UploadPanel() {
    return (
        <section className={styles.upload}>
            <h2>OpenAPI input</h2>

            <textarea
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
                    />
                </label>

                <Button>
                    Parse
                </Button>
            </div>
        </section>
    );
}

export default UploadPanel