import { supabase } from '../supabase';
import type {
  AgentTurnResponse,
  DashboardPayload,
  HabitDefinition,
  HydrationLog,
  MealLog,
  Profile,
  SleepLog,
  UserPreferences,
} from '../types';

const todayIso = () => new Date().toISOString().slice(0, 10);

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};

async function getUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Not authenticated');
  return data.user.id;
}

export async function fetchProfile(): Promise<Profile> {
  const userId = await getUserId();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as Profile;
}

export async function fetchPreferences(): Promise<UserPreferences> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as UserPreferences;
}

export async function updateProfile(updates: Partial<Profile>) {
  const userId = await getUserId();
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw error;
}

export async function updatePreferences(updates: Partial<UserPreferences>) {
  const userId = await getUserId();
  const { error } = await supabase.from('user_preferences').update(updates).eq('user_id', userId);
  if (error) throw error;
}

function calcHabitStreak(habitId: string, completions: { habit_id: string; completed_date: string; status: string }[]) {
  const dates = completions
    .filter((c) => c.habit_id === habitId && c.status === 'completed')
    .map((c) => c.completed_date)
    .sort()
    .reverse();

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (dates.includes(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export async function fetchDashboard(): Promise<DashboardPayload> {
  const userId = await getUserId();
  const today = todayIso();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    profileRes,
    prefsRes,
    hydrationRes,
    sleepRes,
    weekSleepRes,
    habitsRes,
    completionsRes,
    mealsRes,
    insightRes,
    achievementsRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
    supabase
      .from('daily_hydration_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', startOfToday())
      .lte('logged_at', endOfToday())
      .order('logged_at', { ascending: false }),
    supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('sleep_date', today)
      .maybeSingle(),
    supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('sleep_date', weekAgo.toISOString().slice(0, 10))
      .order('sleep_date', { ascending: false }),
    supabase
      .from('habit_definitions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paused', false)
      .order('created_at'),
    supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_date', weekAgo.toISOString().slice(0, 10)),
    supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', startOfToday())
      .lte('logged_at', endOfToday())
      .order('logged_at', { ascending: false }),
    supabase
      .from('insight_snapshots')
      .select('*')
      .eq('user_id', userId)
      .eq('insight_date', today)
      .maybeSingle(),
    supabase
      .from('achievement_events')
      .select('id, title, earned_at')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(5),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (prefsRes.error) throw prefsRes.error;

  const profile = profileRes.data as Profile;
  const hydrationLogs = (hydrationRes.data ?? []) as HydrationLog[];
  const meals = (mealsRes.data ?? []) as MealLog[];
  const habits = (habitsRes.data ?? []) as HabitDefinition[];
  const completions = completionsRes.data ?? [];
  const weekSleep = (weekSleepRes.data ?? []) as SleepLog[];

  const todayTotalMl = hydrationLogs.reduce((sum, l) => sum + l.amount_ml, 0);
  const todayCalories = meals.reduce((sum, m) => sum + (m.calories ?? 0), 0);
  const todayProtein = meals.reduce((sum, m) => sum + (m.protein_g ?? 0), 0);

  const weekAvgMinutes =
    weekSleep.length > 0
      ? weekSleep.reduce((s, l) => s + l.duration_minutes, 0) / weekSleep.length
      : 0;

  const habitItems = habits.map((h) => ({
    ...h,
    completedToday: completions.some(
      (c) => c.habit_id === h.id && c.completed_date === today && c.status === 'completed',
    ),
    streak: calcHabitStreak(h.id, completions),
  }));

  let insight = insightRes.data as DashboardPayload['insight'];
  if (!insight) {
    insight = generateLocalInsight(profile, todayTotalMl, habitItems, weekAvgMinutes);
  }

  return {
    profile,
    preferences: prefsRes.data as UserPreferences,
    hydration: {
      todayTotalMl,
      goalMl: profile.hydration_goal_ml ?? 2500,
      logs: hydrationLogs,
    },
    sleep: {
      lastNight: (sleepRes.data as SleepLog | null) ?? null,
      goalHours: profile.sleep_goal_hours ?? 8,
      weekAverageHours: weekAvgMinutes / 60,
    },
    habits: {
      items: habitItems,
      completedCount: habitItems.filter((h) => h.completedToday).length,
      totalActive: habitItems.length,
    },
    nutrition: { todayCalories, todayProtein, meals },
    insight,
    streaks: {
      hydrationDays: todayTotalMl >= (profile.hydration_goal_ml ?? 2500) * 0.8 ? 1 : 0,
      habitDays: habitItems.some((h) => h.completedToday) ? 1 : 0,
    },
    achievements: achievementsRes.data ?? [],
  };
}

function generateLocalInsight(
  profile: Profile,
  hydrationMl: number,
  habits: { completedToday: boolean; streak: number }[],
  weekSleepHours: number,
): DashboardPayload['insight'] {
  const goal = profile.hydration_goal_ml ?? 2500;
  const hydrationPct = Math.round((hydrationMl / goal) * 100);
  const habitsDone = habits.filter((h) => h.completedToday).length;

  let title = 'A calm start to your day';
  let body = 'Take a moment to check in with yourself. Small consistent steps add up.';

  if (hydrationPct < 40) {
    title = 'Hydration could use attention';
    body = `You're at ${hydrationPct}% of your water goal. A glass now would be a gentle win.`;
  } else if (habitsDone === habits.length && habits.length > 0) {
    title = 'All habits complete!';
    body = 'You showed up for yourself today. Aurora is proud of your consistency.';
  } else if (weekSleepHours > 0 && weekSleepHours < 6.5) {
    title = 'Sleep has been short this week';
    body = `Your average is ${weekSleepHours.toFixed(1)} hours. Consider an earlier wind-down tonight.`;
  } else if (hydrationPct >= 80) {
    title = 'Great hydration momentum';
    body = `You're at ${hydrationPct}% today. Keep sipping steadily through the afternoon.`;
  }

  return {
    id: 'local',
    user_id: profile.id,
    insight_date: todayIso(),
    title,
    body,
    category: 'daily',
  };
}

export async function invokeBootstrap(): Promise<DashboardPayload> {
  try {
    const { data, error } = await supabase.functions.invoke('bootstrap');
    if (!error && data) return data as DashboardPayload;
  } catch {
    // Fall through to direct query
  }
  return fetchDashboard();
}

export async function addHydration(amountMl: number, note?: string) {
  const userId = await getUserId();
  const { error } = await supabase.from('daily_hydration_logs').insert({
    user_id: userId,
    amount_ml: amountMl,
    note: note ?? null,
  });
  if (error) throw error;
}

export async function logSleep(input: {
  sleepDate: string;
  durationMinutes: number;
  quality?: number;
  note?: string;
}) {
  const userId = await getUserId();
  const { error } = await supabase.from('sleep_logs').upsert(
    {
      user_id: userId,
      sleep_date: input.sleepDate,
      duration_minutes: input.durationMinutes,
      quality: input.quality ?? null,
      note: input.note ?? null,
    },
    { onConflict: 'user_id,sleep_date' },
  );
  if (error) throw error;
}

export async function fetchSleepLogs(days = 7): Promise<SleepLog[]> {
  const userId = await getUserId();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('sleep_date', since.toISOString().slice(0, 10))
    .order('sleep_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as SleepLog[];
}

export async function fetchHydrationHistory(days = 7): Promise<HydrationLog[]> {
  const userId = await getUserId();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from('daily_hydration_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as HydrationLog[];
}

export async function fetchHabits() {
  const userId = await getUserId();
  const today = todayIso();
  const { data: habits, error } = await supabase
    .from('habit_definitions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;

  const { data: completions } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('user_id', userId);

  return ((habits ?? []) as HabitDefinition[]).map((h) => ({
    ...h,
    completedToday: (completions ?? []).some(
      (c) => c.habit_id === h.id && c.completed_date === today && c.status === 'completed',
    ),
    streak: calcHabitStreak(h.id, completions ?? []),
  }));
}

export async function createHabit(input: {
  title: string;
  description?: string;
  icon?: string;
}) {
  const userId = await getUserId();
  const { error } = await supabase.from('habit_definitions').insert({
    user_id: userId,
    title: input.title,
    description: input.description ?? null,
    icon: input.icon ?? '✨',
  });
  if (error) throw error;
}

export async function toggleHabitComplete(habitId: string, complete: boolean) {
  const userId = await getUserId();
  const today = todayIso();
  if (complete) {
    const { error } = await supabase.from('habit_completions').upsert(
      { habit_id: habitId, user_id: userId, completed_date: today, status: 'completed' },
      { onConflict: 'habit_id,completed_date' },
    );
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_date', today);
    if (error) throw error;
  }
}

export async function updateHabit(habitId: string, updates: Partial<HabitDefinition>) {
  const { error } = await supabase.from('habit_definitions').update(updates).eq('id', habitId);
  if (error) throw error;
}

export async function fetchMeals(days = 1): Promise<MealLog[]> {
  const userId = await getUserId();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as MealLog[];
}

export async function addMeal(input: {
  name: string;
  mealType: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  note?: string;
}) {
  const userId = await getUserId();
  const { error } = await supabase.from('meal_logs').insert({
    user_id: userId,
    name: input.name,
    meal_type: input.mealType,
    calories: input.calories ?? null,
    protein_g: input.proteinG ?? null,
    carbs_g: input.carbsG ?? null,
    fat_g: input.fatG ?? null,
    note: input.note ?? null,
  });
  if (error) throw error;
}

export async function agentTurn(input: {
  text?: string;
  audioBase64?: string;
  threadId?: string;
}): Promise<AgentTurnResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('agent-turn', { body: input });
    if (!error && data) return data as AgentTurnResponse;
  } catch {
    // fallback below
  }

  return localAgentTurn(input.text ?? '');
}

async function localAgentTurn(text: string): Promise<AgentTurnResponse> {
  const lower = text.toLowerCase().trim();
  const actions: AgentTurnResponse['actions'] = [];
  let reply = "I'm here as your health coach. Ask about hydration, sleep, habits, nutrition, or tell me what you'd like to log.";
  let recommendations: string[] = [];

  const dashboard = await fetchDashboard();
  const hydrationPercent =
    dashboard.hydration.goalMl > 0
      ? Math.round((dashboard.hydration.todayTotalMl / dashboard.hydration.goalMl) * 100)
      : 0;
  const firstHabit =
    dashboard.habits.items.find((habit) => !habit.completedToday)?.title ??
    dashboard.habits.items[0]?.title;

  const waterMatch = lower.match(/(\d+)\s*(ml|milliliters?|liters?|l|oz|ounces?|cups?)/);
  if (lower.includes('water') || lower.includes('drank') || lower.includes('hydration')) {
    if (waterMatch) {
      let ml = parseInt(waterMatch[1], 10);
      const unit = waterMatch[2];
      if (unit.startsWith('l')) ml *= 1000;
      else if (unit.startsWith('oz')) ml = Math.round(ml * 29.57);
      else if (unit.startsWith('cup')) ml *= 240;
      await addHydration(ml);
      actions.push({
        tool: 'add_hydration',
        success: true,
        message: `I've added ${ml}ml to today's hydration progress.`,
      });
      const newTotal = dashboard.hydration.todayTotalMl + ml;
      const newPercent = dashboard.hydration.goalMl > 0
        ? Math.round((newTotal / dashboard.hydration.goalMl) * 100)
        : 0;
      reply = `Great. I've added ${ml}ml to today's hydration progress. That brings you to about ${newPercent}% of your daily goal.`;
      recommendations = [
        newPercent < 80
          ? 'Another small glass later today would keep your momentum steady.'
          : 'You are in a strong spot today, so just keep sipping consistently.'
      ];
    } else {
      reply = 'How much water did you drink? For example, say "I drank 500ml water".';
    }
  } else if ((lower.includes('slept') || lower.includes('sleep')) && /\d/.test(lower)) {
    const hoursMatch = lower.match(/(\d+(?:\.\d+)?)\s*hours?/);
    if (hoursMatch) {
      const hours = parseFloat(hoursMatch[1]);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await logSleep({
        sleepDate: yesterday.toISOString().slice(0, 10),
        durationMinutes: Math.round(hours * 60),
      });
      actions.push({
        tool: 'log_sleep',
        success: true,
        message: `I've updated your sleep log with ${hours} hours.`,
      });
      reply = `I've updated your sleep log with ${hours} hours for last night. Tracking it consistently makes it much easier to spot patterns.`;
      recommendations = [
        hours < dashboard.sleep.goalHours
          ? `Try protecting an extra ${Math.max(0.5, Math.round((dashboard.sleep.goalHours - hours) * 2) / 2)} hours tonight if you can.`
          : 'If you repeat that routine tonight, your weekly average should stay on track.'
      ];
    } else {
      reply = 'How many hours did you sleep? For example, "I slept 7 hours last night".';
    }
  } else if (lower.includes('habit') && (lower.includes('create') || lower.includes('meditate') || lower.includes('start'))) {
    const titleMatch = text.match(/habit (?:to )?(.+)/i);
    const title = titleMatch?.[1]?.replace(/every.*$/i, '').trim() || 'Morning meditation';
    await createHabit({ title, icon: '🧘' });
    actions.push({
      tool: 'create_habit',
      success: true,
      message: `Done. I've created the habit "${title}".`,
    });
    reply = `Done. I've created the habit "${title}". Keep it tiny and repeatable so it feels easy to maintain.`;
    recommendations = ['Aim to complete it at the same time each day for the first week.'];
  } else if (lower.includes('how am i') || lower.includes('how\'m i') || lower.includes('progress')) {
    reply = `This week you're averaging ${dashboard.sleep.weekAverageHours.toFixed(1)} hours of sleep. Today you've had ${dashboard.hydration.todayTotalMl}ml of water, which is ${hydrationPercent}% of goal, and you've completed ${dashboard.habits.completedCount} of ${dashboard.habits.totalActive} habits. ${dashboard.insight?.body ?? 'Your consistency is building one step at a time.'}`;
    recommendations = [
      firstHabit
        ? `Your best next step is to complete ${firstHabit} and keep the day moving in the right direction.`
        : 'Choose one small health win today so progress stays simple.'
    ];
  } else if (lower.includes('did i drink enough water')) {
    reply = hydrationPercent >= 100
      ? `Yes. You have already reached your hydration goal with ${dashboard.hydration.todayTotalMl}ml today.`
      : `Not yet. You're at ${dashboard.hydration.todayTotalMl}ml today, which is ${hydrationPercent}% of your goal.`;
    recommendations = [
      hydrationPercent >= 100
        ? 'Just keep sipping normally through the rest of the day.'
        : `A ${Math.min(500, Math.max(250, dashboard.hydration.goalMl - dashboard.hydration.todayTotalMl))}ml drink would close a meaningful part of the gap.`
    ];
  } else if (lower.includes('improve my sleep') || lower.includes('sleep better')) {
    reply = dashboard.sleep.weekAverageHours > 0
      ? `Your sleep average is ${dashboard.sleep.weekAverageHours.toFixed(1)} hours this week, with a goal of ${dashboard.sleep.goalHours} hours. The easiest improvement is to make tonight's wind-down a little earlier and more consistent.`
      : `I don't have much sleep history yet, so the best place to start is logging tonight and protecting a steady bedtime.`;
    recommendations = [
      'Aim for a 30-minute earlier wind-down tonight and keep screens lower-stimulation near bed.'
    ];
  } else if (lower.includes('what habits should i focus on') || lower.includes('which habits should i focus on')) {
    if (firstHabit) {
      reply = `Focus on ${firstHabit} first. It looks like the clearest next habit to complete today without creating extra pressure.`;
      recommendations = [`Finish ${firstHabit} before adding anything new today.`];
    } else {
      reply = 'You do not have an active habit in focus yet. A tiny daily habit is the best place to start.';
      recommendations = ['Create a habit that takes under 5 minutes so consistency feels easy.'];
    }
  } else if (lower.includes('meal') || lower.includes('ate') || lower.includes('lunch') || lower.includes('breakfast')) {
    reply = 'Tell me what you ate and I can log it. For example, "I had a chicken salad for lunch, about 450 calories".';
  }

  return {
    threadId: 'local',
    transcript: text,
    reply,
    actions,
    recommendations,
  };
}

export async function fetchWeeklyReport() {
  const userId = await getUserId();
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [hydration, sleep, habits, meals, achievements] = await Promise.all([
    supabase
      .from('daily_hydration_logs')
      .select('amount_ml, logged_at')
      .eq('user_id', userId)
      .gte('logged_at', since.toISOString()),
    supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('sleep_date', since.toISOString().slice(0, 10)),
    supabase.from('habit_completions').select('*').eq('user_id', userId).eq('status', 'completed').gte('completed_date', since.toISOString().slice(0, 10)),
    supabase.from('meal_logs').select('calories').eq('user_id', userId).gte('logged_at', since.toISOString()),
    supabase.from('achievement_events').select('*').eq('user_id', userId).order('earned_at', { ascending: false }).limit(10),
  ]);

  const totalWater = (hydration.data ?? []).reduce((s, r) => s + r.amount_ml, 0);
  const avgSleep =
    (sleep.data ?? []).length > 0
      ? (sleep.data ?? []).reduce((s, r) => s + r.duration_minutes, 0) / (sleep.data ?? []).length / 60
      : 0;
  const habitCompletions = (habits.data ?? []).length;
  const totalCalories = (meals.data ?? []).reduce((s, r) => s + (r.calories ?? 0), 0);

  const consistencyScore = Math.min(
    100,
    Math.round(
      ((hydration.data ?? []).length > 0 ? 25 : 0) +
        ((sleep.data ?? []).length >= 5 ? 25 : (sleep.data ?? []).length * 5) +
        Math.min(25, habitCompletions * 3) +
        ((meals.data ?? []).length > 0 ? 25 : 0),
    ),
  );

  return {
    totalWaterMl: totalWater,
    avgSleepHours: avgSleep,
    habitCompletions,
    totalCalories,
    consistencyScore,
    achievements: achievements.data ?? [],
    sleepLogs: sleep.data ?? [],
  };
}
