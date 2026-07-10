import { DayPlan } from "@/types/MealPlan";
import styles from "./MealPlanView.module.css";
import { formatExpirationDateString } from "@/utils/dateFormatter";

type Props = {
  mealPlan: DayPlan[];
};

export default function MealPlanView({ mealPlan }: Props) {
  return (
    <section className={styles.planGrid}>
      {mealPlan.map((dayPlan, index) => (
        <article key={index} className={styles.dayCard}>
          <header className={styles.dayHeader}>
            <h2 className={styles.dayTitle}>{dayPlan.day}</h2>
            <span className={styles.dayBadge}>
              {dayPlan.meals.length} meals
            </span>
          </header>

          <div className={styles.mealsList}>
            {dayPlan.meals.map((meal, mealIndex) => (
              <div key={mealIndex} className={styles.mealCard}>
                <div className={styles.mealTopRow}>
                  <h3 className={styles.mealTitle}>
                    <span className={styles.mealType}>{meal.type}</span>
                    <span className={styles.mealRecipe}>{meal.recipe}</span>
                  </h3>
                </div>

                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Available ingredients</p>
                  <div className={styles.tagWrap}>
                    {meal.availableIngredients.length > 0 ? (
                      meal.availableIngredients.map((product, idx) => (
                        <span key={idx} className={styles.availableTag}>
                          {product.name}
                          <span className={styles.tagMeta}>
                            {" "}
                            ·{" "}
                            {formatExpirationDateString(product.expirationDate)}
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className={styles.emptyTag}>None</span>
                    )}
                  </div>
                </div>

                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Missing ingredients</p>
                  <div className={styles.tagWrap}>
                    {meal.missingIngredients.length > 0 ? (
                      meal.missingIngredients.map((ingredient, idx) => (
                        <span key={idx} className={styles.missingTag}>
                          {ingredient}
                        </span>
                      ))
                    ) : (
                      <span className={styles.emptyTag}>None</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
