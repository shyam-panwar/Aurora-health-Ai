import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { EmptyState } from '../../../components/ui/EmptyState';
import { createHabit, fetchHabits, toggleHabitComplete, updateHabit } from '../../../lib/api/client';
import { queryKeys } from '../../../lib/api/queries';
import { useInvalidateDashboard } from '../../home/hooks/useHomeDashboard';
import { HabitCard } from '../components/HabitCard';

export const HabitsScreen = () => {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const invalidate = useInvalidateDashboard();

  const { data: habits = [], refetch } = useQuery({
    queryKey: queryKeys.habits,
    queryFn: fetchHabits,
  });

  const active = habits.filter((h) => !h.is_paused);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await createHabit({ title: title.trim() });
      setTitle('');
      await refetch();
      invalidate();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (id: string, complete: boolean) => {
    try {
      await toggleHabitComplete(id, complete);
      await refetch();
      invalidate();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    }
  };

  const handleLongPress = (id: string) => {
    Alert.alert('Habit options', undefined, [
      {
        text: 'Pause habit',
        onPress: async () => {
          await updateHabit(id, { is_paused: true });
          refetch();
          invalidate();
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <AppScreen>
      <AppText variant="title">Habits</AppText>
      <AppText color="textSecondary">Build gentle routines with streak-aware tracking.</AppText>

      <AppInput label="New habit" onChangeText={setTitle} placeholder="Morning stretch" value={title} />
      <AppButton busy={busy} onPress={handleCreate} title="Create habit" variant="secondary" />

      {active.length === 0 ? (
        <EmptyState
          description="Create a habit above or ask Aurora to set one up for you."
          emoji="🌱"
          title="No habits yet"
        />
      ) : (
        active.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onLongPress={handleLongPress}
            onToggle={handleToggle}
          />
        ))
      )}
    </AppScreen>
  );
};

const _styles = StyleSheet.create({});
