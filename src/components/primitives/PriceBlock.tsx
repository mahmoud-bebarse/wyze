import { formatPrice } from "../../utils/format";
import styles from "./PriceBlock.module.css";

interface Props {
  price: number;
  compareAt?: number;
  suffix?: string;
  isFree?: boolean;
  size?: "md" | "sm";
  align?: "start" | "end";
}

/**
 * Compare-at price with strike, then active price.
 * If `isFree`, active reads "FREE" in indigo.
 */
export function PriceBlock({
  price,
  compareAt,
  suffix,
  isFree,
  size = "md",
  align = "end",
}: Props) {
  const showCompare = compareAt !== undefined && compareAt > price;

  return (
    <div
      className={[
        styles.wrap,
        size === "sm" ? styles.small : "",
        align === "end" ? styles.alignEnd : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showCompare && (
        <s className={styles.compare} aria-label={`Was ${formatPrice(compareAt)}`}>
          {formatPrice(compareAt)}
          {suffix ?? ""}
        </s>
      )}
      <span className={styles.active}>
        {isFree ? "FREE" : formatPrice(price)}
        {!isFree && suffix ? suffix : ""}
      </span>
    </div>
  );
}
