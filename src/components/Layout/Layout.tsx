import { Accordion } from "../Accordion/Accordion";
import { ReviewPanel } from "../ReviewPanel/ReviewPanel";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <div className={styles.page}>
      <div className={styles.mobileHeader}>
        <h1>Let’s get started!</h1>
      </div>
      <div className={styles.grid}>
        <main className={styles.builder}>
          <Accordion />
        </main>
        <div className={styles.review}>
          <ReviewPanel />
        </div>
      </div>
    </div>
  );
}
