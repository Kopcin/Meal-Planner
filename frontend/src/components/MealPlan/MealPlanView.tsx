import { DayPlanViewModel } from "@/types/MealPlan";
import styles from "./MealPlanView.module.css";
import { formatDateString } from "@/utils/dateFormatter";

type Props = {
  mealPlan: DayPlanViewModel[];
  onMoveMeal: (
    fromDayIndex: number,
    fromMealIndex: number,
    toDayIndex: number,
    toMealIndex: number,
  ) => void;
  onStartEditing?: () => void;
  changedMeals: Set<string>;
};

export default function MealPlanView({
  mealPlan,
  onMoveMeal,
  onStartEditing,
  changedMeals,
}: Props) {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    dayIndex: number,
    mealIndex: number,
  ) => {
    onStartEditing?.();

    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ dayIndex, mealIndex }),
    );
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    dayIndex: number,
    mealIndex: number,
  ) => {
    event.preventDefault();

    const data = event.dataTransfer.getData("application/json");

    if (!data) return;

    const { dayIndex: fromDayIndex, mealIndex: fromMealIndex } =
      JSON.parse(data);

    onMoveMeal(fromDayIndex, fromMealIndex, dayIndex, mealIndex);
  };

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <section className={styles.planGrid}>
      {mealPlan.map((dayPlan, dayIndex) => (
        <article key={dayIndex} className={styles.dayCard}>
          <header className={styles.dayHeader}>
            <h2 className={styles.dayTitle}>
              Day {dayIndex + 1}
              <span className={styles.dayDate}>
                {" "}
                {formatDateString(dayPlan.date)}
              </span>
            </h2>

            <span className={styles.dayBadge}>
              {dayPlan.mealSlots.length} meals
            </span>
          </header>

          <div className={styles.mealsList}>
            {dayPlan.mealSlots.map((meal, mealIndex) => (
              <div
                key={meal.recipeId}
                className={`${styles.mealCard} ${changedMeals.has(`${dayIndex}-${mealIndex}`) ? styles.changedMeal : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, dayIndex, mealIndex)}
                onDrop={(e) => handleDrop(e, dayIndex, mealIndex)}
                onDragOver={allowDrop}
              >
                <div className={styles.mealTopRow}>
                  <h3 className={styles.mealTitle}>
                    <span className={styles.mealType}>{meal.label}</span>
                    <span className={styles.mealRecipe}>{meal.recipeName}</span>
                  </h3>
                </div>

                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Available ingredients</p>
                  <div className={styles.tagWrap}>
                    {(meal.availableIngredients ?? []).length > 0 ? (
                      (meal.availableIngredients ?? []).map((product, idx) => (
                        <span key={idx} className={styles.availableTag}>
                          {product.name}
                          <span className={styles.tagMeta}>
                            {" "}
                            · {formatDateString(product.expirationDate)}
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
                    {(meal.missingIngredients ?? []).length > 0 ? (
                      (meal.missingIngredients ?? []).map((ingredient, idx) => (
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
