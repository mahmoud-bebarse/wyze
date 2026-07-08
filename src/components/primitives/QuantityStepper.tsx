import { MinusIcon, PlusIcon } from "../icons/Icons";
import { useCart } from "../../state/CartContext";
import styles from "./QuantityStepper.module.css";

interface Props {
  productId: string;
  variantId?: string;
  qty: number;
  ariaLabel?: string;
  size?: "md" | "sm";
}

export function QuantityStepper({
  productId,
  variantId,
  qty,
  ariaLabel,
  size = "md",
}: Props) {
  const { dispatch } = useCart();
  const disabled = qty <= 0;

  return (
    <div
      className={`${styles.stepper} ${size === "sm" ? styles.small : ""}`}
      role="group"
      aria-label={ariaLabel ?? "Quantity"}
    >
      <button
        type="button"
        className={styles.button}
        aria-label="Decrease quantity"
        disabled={disabled}
        onClick={() => dispatch({ type: "DECREMENT", productId, variantId })}
      >
        <MinusIcon />
      </button>
      <span className={styles.count} aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        className={styles.button}
        aria-label="Increase quantity"
        onClick={() => dispatch({ type: "INCREMENT", productId, variantId })}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
