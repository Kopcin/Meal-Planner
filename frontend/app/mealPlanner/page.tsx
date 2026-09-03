import Navbar from "@/components/Navbar";
import MealPlannerWorkspace from "@/components/MealPlan/MealPlannerWorkspace";
import styles from "./mealPlannerPage.module.css";

export default function MealPlanPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <MealPlannerWorkspace />
    </div>
  );
}
