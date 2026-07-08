import { useCart } from "../../state/CartContext";
import { getSelectedCountForStep } from "../../state/selectors";
import type { StepMeta } from "../../state/types";
import { ChevronDownIcon, ChevronUpIcon, StepIcon } from "../icons/Icons";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./Step.module.css";

interface Props {
  meta: StepMeta;
}

export function Step({ meta }: Props) {
  const { state, dispatch, catalog } = useCart();
  const isOpen = state.openStep === meta.index;
  const count = getSelectedCountForStep(state, catalog, meta.index);
  const stepProducts = catalog.products.filter(
    (p) => p.step === meta.index && p.showInStep,
  );

  const bodyId = `step-body-${meta.index}`;
  const headerId = `step-header-${meta.index}`;

  return (
    <section
      className={`${styles.step} ${isOpen ? styles.open : ""}`}
      aria-labelledby={headerId}
    >
      <div className={styles.headerWrap}>
        <div className={styles.stepLabel}>STEP {meta.index} OF 4</div>
        <button
          type="button"
          id={headerId}
          className={styles.header}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          onClick={() =>
            dispatch({
              type: "SET_OPEN_STEP",
              step: isOpen ? null : meta.index,
            })
          }
        >
          <span className={styles.headerLeft}>
            <StepIcon icon={meta.icon} className={styles.icon} />
            <span className={styles.title}>{meta.title}</span>
          </span>
          <span className={styles.headerRight}>
            {count > 0 && (
              <span className={styles.count}>
                {count} selected
              </span>
            )}
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </button>
      </div>

      {isOpen && (
        <div id={bodyId} role="region" className={styles.body}>
          {stepProducts.length > 0 ? (
            <>
              <div className={styles.grid}>
                {stepProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {meta.nextLabel && meta.index < 4 && (
                <div className={styles.nextRow}>
                  <button
                    type="button"
                    className={styles.nextButton}
                    onClick={() =>
                      dispatch({
                        type: "SET_OPEN_STEP",
                        step: (meta.index + 1) as 2 | 3 | 4,
                      })
                    }
                  >
                    {meta.nextLabel}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.placeholder}>
              <p>
                This step's items are already included in your system. Review
                them in the summary on the right.
              </p>
              {meta.nextLabel && meta.index < 4 && (
                <button
                  type="button"
                  className={styles.nextButton}
                  onClick={() =>
                    dispatch({
                      type: "SET_OPEN_STEP",
                      step: (meta.index + 1) as 2 | 3 | 4,
                    })
                  }
                >
                  {meta.nextLabel}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
