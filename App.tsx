import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { supabase } from './utils/supabase';

export default function App() {
  const [todos, setTodos] = useState<Array<{ id: number | string; name: string }>>([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const { data: fetchedTodos, error } = await supabase.from('todos').select();

        if (error) {
          console.error('Error fetching todos:', error.message);
          return;
        }

        if (fetchedTodos && fetchedTodos.length > 0) {
          setTodos(fetchedTodos);
        }
      } catch (error) {
        console.error('Error fetching todos:', error instanceof Error ? error.message : error);
      }
    };

    void getTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  item: {
    fontSize: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
});
