import { useCart } from "../../state/CartContext";
import { getActiveQty } from "../../state/selectors";
import type { Product } from "../../state/types";
import { Badge } from "../primitives/Badge";
import { PriceBlock } from "../primitives/PriceBlock";
import { QuantityStepper } from "../primitives/QuantityStepper";
import { VariantSelector } from "./VariantSelector";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { state, dispatch } = useCart();

  const activeVariantId = product.variants
    ? state.activeVariant[product.id] ?? product.variants[0].id
    : undefined;

  const qty = getActiveQty(state, product);
  const isSelected = qty > 0;

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      aria-label={product.title}
    >
      {product.badge && (
        <div className={styles.badge}>
          <Badge>{product.badge}</Badge>
        </div>
      )}

      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.title} className={styles.image} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        {product.description && (
          <p className={styles.description}>
            {product.description}
            {product.learnMoreUrl && (
              <>
                {" "}
                <a href={product.learnMoreUrl} className={styles.learnMore}>
                  Learn More
                </a>
              </>
            )}
          </p>
        )}

        {product.variants && activeVariantId && (
          <div className={styles.variants}>
            <VariantSelector
              productId={product.id}
              variants={product.variants}
              activeVariantId={activeVariantId}
              onSelect={(variantId) =>
                dispatch({
                  type: "SELECT_VARIANT",
                  productId: product.id,
                  variantId,
                })
              }
            />
          </div>
        )}

        <div className={styles.footer}>
          <QuantityStepper
            productId={product.id}
            variantId={activeVariantId}
            qty={qty}
            ariaLabel={`Quantity of ${product.title}`}
          />
          <PriceBlock
            price={product.price}
            compareAt={product.compareAt}
            suffix={product.priceSuffix}
          />
        </div>
      </div>
    </article>
  );
}
