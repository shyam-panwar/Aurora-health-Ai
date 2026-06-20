export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  sleep_goal_hours: number;
  hydration_goal_ml: number;
  timezone: string;
};

export type UserPreferences = {
  user_id: string;
  hydration_reminders: boolean;
  sleep_reminders: boolean;
  habit_reminders: boolean;
  nutrition_reminders: boolean;
  daily_insight: boolean;
  reminder_time: string;
  tracking_method: string;
  onboarding_step: number;
};

export type HydrationLog = {
  id: string;
  user_id: string;
  logged_at: string;
  amount_ml: number;
  note: string | null;
};

export type SleepLog = {
  id: string;
  user_id: string;
  sleep_date: string;
  bedtime: string | null;
  wake_time: string | null;
  duration_minutes: number;
  quality: number | null;
  note: string | null;
};

export type HabitDefinition = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  frequency: string;
  target_days: number[];
  is_paused: boolean;
  icon: string;
  created_at: string;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  status: 'completed' | 'skipped';
};

export type MealLog = {
  id: string;
  user_id: string;
  logged_at: string;
  meal_type: string;
  name: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  note: string | null;
};

export type InsightSnapshot = {
  id: string;
  user_id: string;
  insight_date: string;
  title: string;
  body: string;
  category: string;
};

export type ActionResult = {
  tool: string;
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
};

export type DashboardPayload = {
  profile: Profile;
  preferences: UserPreferences;
  hydration: {
    todayTotalMl: number;
    goalMl: number;
    logs: HydrationLog[];
  };
  sleep: {
    lastNight: SleepLog | null;
    goalHours: number;
    weekAverageHours: number;
  };
  habits: {
    items: (HabitDefinition & { completedToday: boolean; streak: number })[];
    completedCount: number;
    totalActive: number;
  };
  nutrition: {
    todayCalories: number;
    todayProtein: number;
    meals: MealLog[];
  };
  insight: InsightSnapshot | null;
  streaks: {
    hydrationDays: number;
    habitDays: number;
  };
  achievements: { id: string; title: string; earned_at: string }[];
};

export type AgentTurnResponse = {
  threadId: string;
  transcript: string;
  reply: string;
  actions: ActionResult[];
  recommendations?: string[];
  audioBase64?: string;
  audioMimeType?: string;
};
