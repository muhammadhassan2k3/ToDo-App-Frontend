import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch all todos from the server
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Add or Edit Todo
  const addOrEditTodo = async () => {
    if (editingTodo) {
      await axios.put(`http://localhost:3000/todos/${editingTodo.id}`, {
        text: newTodo,
      });
    } else {
      await axios.post('http://localhost:3000/todos', {text: newTodo});
    }
    setNewTodo('');
    setEditingTodo(null);
    fetchTodos();
  };

  // Delete Todo
  const deleteTodo = async id => {
    await axios.delete(`http://localhost:3000/todos/${id}`);
    fetchTodos();
  };

  // Set a Todo for editing
  const editTodo = todo => {
    setNewTodo(todo.text);
    setEditingTodo(todo);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <TextInput
        placeholder="Enter new todo"
        value={newTodo}
        onChangeText={setNewTodo}
        style={styles.input}
      />

      <TouchableOpacity style={styles.addButton} onPress={addOrEditTodo}>
        <Text style={styles.addButtonText}>
          {editingTodo ? 'Edit Todo' : 'Add Todo'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editTodo(item)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  todoItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    color: '#2196F3',
    marginRight: 10,
    fontSize: 16,
  },
  deleteButton: {
    color: '#E57373',
    fontSize: 16,
  },
});

export default App;
