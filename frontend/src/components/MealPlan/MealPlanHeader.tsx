import styles from "./MealPlanHeader.module.css";

type Props = {
  canSave: boolean;
  onGenerate: () => void;
  onSave: () => void;
};

export default function MealPlanHeader({ canSave, onGenerate, onSave }: Props) {
  return (
    <section className={styles.headerCard}>
      <div>
        <h1 className={styles.title}>Meal Planner</h1>

        <p className={styles.subtitle}>
          Generate a plan based on what you already have in the fridge.
        </p>
      </div>

      <button onClick={onGenerate} className={styles.generateButton}>
        Generate New Plan
      </button>

      {canSave && (
        <button onClick={onSave} className={styles.generateButton}>
          Save Plan
        </button>
      )}
    </section>
  );
}
