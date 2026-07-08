import { useCart } from "../../state/CartContext";
import type { LineItem } from "../../state/selectors";
import { PriceBlock } from "../primitives/PriceBlock";
import { QuantityStepper } from "../primitives/QuantityStepper";
import styles from "./ReviewLine.module.css";

interface Props {
  item: LineItem;
}

export function ReviewLine({ item }: Props) {
  const { product, variant, qty, lineTotal, lineCompareAt } = item;
  const isPlan = product.category === "plan";
  const isFree = product.isFree === true;

  const displayName = product.isRequired
    ? `${product.title} (Required)`
    : product.title;

  // For plan lines the design shows /mo suffix and doesn't show a stepper
  // (plan is pre-configured). All other categories get a stepper.
  const showStepper = !isPlan;

  return (
    <div className={styles.line}>
      <div className={styles.thumbWrap}>
        <img
          src={product.thumbnail}
          alt=""
          aria-hidden="true"
          className={styles.thumb}
        />
      </div>

      <div className={styles.name}>
        {isPlan ? (
          <span className={styles.planName}>
            <img src={product.image} alt="" className={styles.planLogo} />
            Cam <span className={styles.planEmph}>Unlimited</span>
          </span>
        ) : (
          <>
            {displayName}
            {variant && (
              <span className={styles.variantLabel}> · {variant.label}</span>
            )}
          </>
        )}
      </div>

      {showStepper ? (
        <div className={styles.stepperCell}>
          <QuantityStepper
            productId={product.id}
            variantId={variant?.id}
            qty={qty}
            ariaLabel={`Quantity of ${product.title}`}
            size="sm"
          />
        </div>
      ) : (
        <div className={styles.stepperCell} />
      )}

      <div className={styles.priceCell}>
        <PriceBlock
          price={isFree ? 0 : lineTotal}
          compareAt={lineCompareAt > lineTotal ? lineCompareAt : undefined}
          suffix={product.priceSuffix}
          isFree={isFree}
          size="sm"
          align="end"
        />
      </div>
    </div>
  );
}

export function ReviewLineEmpty() {
  const { catalog } = useCart();
  return (
    <div className={styles.line}>
      <span className={styles.name} style={{ color: "var(--color-text-muted)" }}>
        Nothing selected yet — start with Step 1 to build your {catalog.steps[0].title.toLowerCase()}.
      </span>
    </div>
  );
}
