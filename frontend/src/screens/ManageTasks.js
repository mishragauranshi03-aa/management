import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import { Card, TextInput, Button, Text, Title, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTasks, createTask, deleteTask, updateTask } from "../api/api";

const STORAGE_KEY = "@tasks_list";

const ManageTasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Snackbar
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Delete popup
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const showSnackbar = (msg) => {
    setSnackbarMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchTasks);
    return unsubscribe;
  }, [navigation]);

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.log("Fetch tasks error:", err?.response?.data || err);
    }
  };

  const handleAddTask = async () => {
    if (!title.trim()) return alert("Please enter task title");

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
        status: "Pending",
      };

      await createTask(data);
      await fetchTasks();

      setTitle("");
      setDescription("");
      setAssignedTo("");

      showSnackbar("Task Added Successfully ! ✅");
    } catch (err) {
      console.log("Add task error:", err?.response?.data || err);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedTaskId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(selectedTaskId);
      await fetchTasks();
      setDeleteModalVisible(false);

      showSnackbar("Task Deleted Successfully ! ✅");
    } catch (err) {
      console.log("Delete task error:", err?.response?.data || err);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(String(task.assigned_to || ""));
  };

  const handleSaveEdit = async () => {
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_to: parseInt(assignedTo) || null,
        status: "Pending",
      };

      await updateTask(editingId, data);
      await fetchTasks();

      setEditingId(null);
      setTitle("");
      setDescription("");
      setAssignedTo("");

      showSnackbar("Saved Successfully ! ✅");
    } catch (err) {
      console.log("Update task error:", err?.response?.data || err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Snackbar Top Center */}
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={2000}
          style={styles.snackbar}
        >
          <Text style={styles.snackbarText}>{snackbarMessage}</Text>
        </Snackbar>
      </View>

      {/* DELETE CONFIRM POPUP */}
      <Modal transparent visible={deleteModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 22, marginBottom: 5 }}></Text>

            <Text style={styles.modalTitle}>
             ⚠️ Are you sure you want to delete?
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.noButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}>
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.yesButton} onPress={confirmDelete}>
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MAIN UI */}
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
              <Text style={styles.cardSubtitle}>Assigned To: {task.assigned_to}</Text>
              <Text style={styles.statusText}>Status: {task.status || "Pending"}</Text>
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
                onPress={() => openDeleteModal(task.id)}
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}

        <Button mode="outlined" style={styles.backButton} onPress={() => navigation.goBack()}>
          Back
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#e8f0fe", flex: 1 },

  snackbarContainer: {
    position: "absolute",
    top: 80,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
  },
  snackbar: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 5,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  snackbarText: {
    color: "green",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  // POPUP STYLES (EXACT screenshot जैसा)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "300",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 26,
    borderRadius: 14,
    elevation: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "85%",
  },
  noButton: {
    backgroundColor: "#6d6d6d",
    width: "40%",
    height: 42,
    justifyContent: "center",
    borderRadius: 22,
  },
  yesButton: {
    backgroundColor: "#d32f2f",
    width: "40%",
    height: 42,
    justifyContent: "center",
    borderRadius: 22,
  },

  // REST UI
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6200ee",
    textAlign: "center",
  },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  addButton: { marginBottom: 20, borderRadius: 30, backgroundColor: "#6200ee" },
  card: {
    marginVertical: 8,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: "#fff",
    padding: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#6200ee" },
  cardSubtitle: { fontSize: 14, color: "#333" },
  statusText: { fontSize: 15, fontWeight: "bold", color: "#1a73e8", marginTop: 5 },
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
