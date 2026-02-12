import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({
  children
}: ButtonProps) {
  return (
    <button
      className={styles.button}
    >
      {children}
    </button>
  );
}