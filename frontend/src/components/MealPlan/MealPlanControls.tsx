import styles from "./MealPlanControls.module.css";

type Props = {
  mealPlanName: string;
  numDays: number;
  mealsPerDay: number;
  setMealPlanName: (value: string) => void;
  setNumDays: (value: number) => void;
  setMealsPerDay: (value: number) => void;
};

export default function MealPlanControls({
  mealPlanName,
  numDays,
  mealsPerDay,
  setMealPlanName,
  setNumDays,
  setMealsPerDay,
}: Props) {
  return (
    <section className={styles.controlsCard}>
      <div className={styles.controlsGrid}>
        <label className={styles.control}>
          <span>Meal Plan Name</span>
          <input
            className={styles.input}
            type="text"
            value={mealPlanName}
            onChange={(e) => setMealPlanName(e.target.value)}
          />
        </label>

        <label className={styles.control}>
          <span>Number of Days</span>

          <input
            className={styles.input}
            type="number"
            min="1"
            max="14"
            value={numDays}
            onChange={(e) => setNumDays(Number(e.target.value) || 1)}
          />
        </label>

        <label className={styles.control}>
          <span>Meals per Day</span>

          <input
            className={styles.input}
            type="number"
            min="1"
            max="5"
            value={mealsPerDay}
            onChange={(e) => setMealsPerDay(Number(e.target.value) || 1)}
          />
        </label>
      </div>
    </section>
  );
}
