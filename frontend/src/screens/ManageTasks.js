import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Card, TextInput, Button, Text, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTasks, createTask, deleteTask, updateTask } from "../api/api";

const STORAGE_KEY = "@tasks_list";

const ManageTasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.log("Fetch tasks error:", err?.response?.data || err);
    }
  };

  // ✅ Add new task
  const handleAddTask = async () => {
    if (!title.trim()) return alert("Please enter task title");

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
      };
      await createTask(data);
      await fetchTasks(); // refresh after add
      setTitle("");
      setDescription("");
      setAssignedTo("");
    } catch (err) {
      console.log("Add task error:", err?.response?.data || err);
    }
  };

  // ✅ Delete task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await fetchTasks(); // refresh after delete
    } catch (err) {
      console.log("Delete task error:", err?.response?.data || err);
    }
  };

  // ✅ Edit button clicked
  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(String(task.assigned_to || ""));
  };

  // ✅ Save updated task
  const handleSaveEdit = async () => {
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_to: parseInt(assignedTo) || null,
        status: "Pending",
      };
      await updateTask(editingId, data);
      await fetchTasks(); // refresh after update
      setEditingId(null);
      setTitle("");
      setDescription("");
      setAssignedTo("");
    } catch (err) {
      console.log("Update task error:", err?.response?.data || err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>
        {editingId ? "Edit Task" : "Add Task"}
      </Title>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Assign To (User ID)"
        value={assignedTo}
        onChangeText={setAssignedTo}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <Button
        mode="contained"
        style={styles.addButton}
        onPress={editingId ? handleSaveEdit : handleAddTask}
      >
        {editingId ? "Save Changes" : "Add Task"}
      </Button>

      {tasks.map((task) => (
        <Card key={task.id} style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.cardSubtitle}>{task.description}</Text>
            <Text style={styles.cardSubtitle}>
              Assigned To: {task.assigned_to}
            </Text>
          </Card.Content>

          <Card.Actions>
            <Button
              mode="outlined"
              style={styles.editButton}
              onPress={() => handleEditClick(task)}
              textColor="#fff"
            >
              Edit
            </Button>
            <Button
              mode="contained"
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(task.id)}
            >
              Delete
            </Button>
          </Card.Actions>
        </Card>
      ))}

      <Button
        mode="outlined"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        Back
      </Button>
    </ScrollView>
  );
};

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#e8f0fe", flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6200ee",
    textAlign: "center",
  },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  addButton: {
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#6200ee",
  },
  card: {
    marginVertical: 8,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: "#fff",
    padding: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#6200ee" },
  cardSubtitle: { fontSize: 14, color: "#333" },
  editButton: { backgroundColor: "#4CAF50", marginRight: 5 },
  deleteButton: { backgroundColor: "#d32f2f" },
  backButton: {
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 6,
    borderColor: "#6200ee",
    borderWidth: 2,
  },
});

export default ManageTasks;
