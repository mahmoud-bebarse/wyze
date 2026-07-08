import type { Variant } from "../../state/types";
import styles from "./VariantSelector.module.css";

interface Props {
  productId: string;
  variants: Variant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  productId,
  variants,
  activeVariantId,
  onSelect,
}: Props) {
  return (
    <div
      className={styles.row}
      role="radiogroup"
      aria-label={`${productId} color`}
    >
      {variants.map((v) => {
        const isActive = v.id === activeVariantId;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.chip} ${isActive ? styles.active : ""}`}
            onClick={() => onSelect(v.id)}
          >
            <span
              className={styles.swatch}
              style={{ background: v.swatch }}
              aria-hidden="true"
            />
            <span className={styles.label}>{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
