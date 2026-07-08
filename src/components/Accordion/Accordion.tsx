import { useCart } from "../../state/CartContext";
import { Step } from "./Step";
import styles from "./Accordion.module.css";

export function Accordion() {
  const { catalog } = useCart();
  return (
    <div className={styles.accordion}>
      {catalog.steps.map((meta) => (
        <Step key={meta.index} meta={meta} />
      ))}
    </div>
  );
}
