import { useCart } from "../../state/CartContext";
import {
  getLineItems,
  getTotals,
  groupByCategory,
} from "../../state/selectors";
import { formatPrice } from "../../utils/format";
import { TruckIcon } from "../icons/Icons";
import { PriceBlock } from "../primitives/PriceBlock";
import { CategorySection } from "./CategorySection";
import styles from "./ReviewPanel.module.css";

export function ReviewPanel() {
  const { state, catalog, saveForLater, lastSavedAt } = useCart();
  const lineItems = getLineItems(state, catalog);
  const grouped = groupByCategory(lineItems);
  const totals = getTotals(state, catalog);

  const handleCheckout = () => {
    window.alert(
      "Checkout is not implemented in this prototype — this is just where the shopper would proceed to payment.",
    );
  };

  return (
    <aside className={styles.panel} aria-label="Your security system review">
      <div className={styles.eyebrow}>REVIEW</div>
      <h2 className={styles.title}>Your security system</h2>
      <p className={styles.tagline}>
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>

      <div className={styles.body}>
        {grouped.length === 0 ? (
          <p className={styles.empty}>
            Nothing selected yet — start with Step 1.
          </p>
        ) : (
          grouped.map((g) => (
            <CategorySection
              key={g.category}
              category={g.category}
              items={g.items}
            />
          ))
        )}
      </div>

      <div className={styles.shipping}>
        <div className={styles.shippingLeft}>
          <TruckIcon className={styles.truck} />
          <span>{catalog.shipping.label}</span>
        </div>
        <PriceBlock
          price={catalog.shipping.price}
          compareAt={catalog.shipping.compareAt}
          isFree={catalog.shipping.isFree}
          size="sm"
          align="end"
        />
      </div>

      <div className={styles.checkoutBlock}>
        <div className={styles.checkoutRow}>
          <SatisfactionSeal />
          <div className={styles.totals}>
            <div className={styles.financingPill}>
              as low as {formatPrice(catalog.financingMonthly)}/mo
            </div>
            <div className={styles.totalRow}>
              {totals.compareAtSubtotal > totals.subtotal && (
                <s className={styles.totalCompare} aria-label={`Was ${formatPrice(totals.compareAtSubtotal)}`}>
                  {formatPrice(totals.compareAtSubtotal)}
                </s>
              )}
              <span className={styles.totalActive}>
                {formatPrice(totals.subtotal)}
              </span>
            </div>
          </div>
        </div>

        {totals.savings > 0 && (
          <p className={styles.savings}>
            Congrats! You’re saving {formatPrice(totals.savings)} on your
            security bundle!
          </p>
        )}

        <button
          type="button"
          className={styles.checkoutButton}
          onClick={handleCheckout}
        >
          Checkout
        </button>

        <button
          type="button"
          className={styles.saveLink}
          onClick={saveForLater}
        >
          Save my system for later
        </button>

        {lastSavedAt !== null && (
          <div className={styles.savedToast} role="status" aria-live="polite">
            Saved! You can close the tab and come back later.
          </div>
        )}
      </div>
    </aside>
  );
}

function SatisfactionSeal() {
  return (
    <div className={styles.seal} aria-hidden="true">
      <svg viewBox="0 0 100 100" width="72" height="72">
        <defs>
          <path
            id="seal-circle"
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <g fill="#4b2aef">
          <circle cx="50" cy="50" r="46" />
          <path
            d="M50 4 L54 12 L63 8 L64 18 L74 18 L72 27 L82 30 L77 38 L86 43 L79 50 L86 57 L77 62 L82 70 L72 73 L74 82 L64 82 L63 92 L54 88 L50 96 L46 88 L37 92 L36 82 L26 82 L28 73 L18 70 L23 62 L14 57 L21 50 L14 43 L23 38 L18 30 L28 27 L26 18 L36 18 L37 8 L46 12 Z"
            fill="#4b2aef"
          />
        </g>
        <text
          x="50"
          y="42"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Inter, sans-serif"
          fontSize="14"
          fontWeight="800"
        >
          100%
        </text>
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Inter, sans-serif"
          fontSize="7"
          fontWeight="600"
        >
          Wyze
        </text>
        <text
          x="50"
          y="63"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Inter, sans-serif"
          fontSize="7"
          fontWeight="600"
        >
          satisfaction
        </text>
        <text
          x="50"
          y="71"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Inter, sans-serif"
          fontSize="7"
          fontWeight="600"
        >
          guarantee
        </text>
      </svg>
    </div>
  );
}
