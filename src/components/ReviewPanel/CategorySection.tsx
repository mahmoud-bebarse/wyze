import type { Category } from "../../state/types";
import type { LineItem } from "../../state/selectors";
import { ReviewLine } from "./ReviewLine";
import styles from "./CategorySection.module.css";

const HEADINGS: Record<Category, string> = {
  cameras: "Cameras",
  sensors: "Sensors",
  accessories: "Accessories",
  plan: "Plan",
};

interface Props {
  category: Category;
  items: LineItem[];
}

export function CategorySection({ category, items }: Props) {
  return (
    <section className={styles.section}>
      <h4 className={styles.heading}>{HEADINGS[category]}</h4>
      <div className={styles.lines}>
        {items.map((item) => (
          <ReviewLine key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
