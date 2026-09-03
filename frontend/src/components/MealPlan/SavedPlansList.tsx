import { MealPlanSummaryResponse } from "@/types/MealPlan";
import styles from "./SavedPlansList.module.css";

type Props = {
  plans: MealPlanSummaryResponse[];
  openedPlanId: number | null;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function SavedPlansList({ plans, openedPlanId, onOpen, onDelete }: Props) {
  return (
    <section className={styles.savedPlansContainer}>
      <h2 className={styles.sectionTitle}>Saved Meal Plans</h2>
      {plans.length === 0 ? (
        <p className={styles.emptySavedPlans}>No saved meal plans yet.</p>
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className={styles.savedPlanItem}>
            <button type="button" onClick={() => onOpen(plan.id)}>
              {openedPlanId === plan.id ? "✎" : "○"} {plan.name}
            </button>
            <button
              type="button"
              className={styles.deletePlanButton}
              onClick={() => onDelete(plan.id)}
              aria-label={`Delete ${plan.name}`}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </section>
  );
}
