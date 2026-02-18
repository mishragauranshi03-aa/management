import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import { Card, TextInput, Button, Text, Title, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTasks, createTask, deleteTask, updateTask } from "../api/api";
import api from "../api/api";

const STORAGE_KEY = "@tasks_list";

const ManageTasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [comment, setComment] = useState("");

  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [assignedError, setAssignedError] = useState("");

  const showSnackbar = (msg) => {
    setSnackbarMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTasks();
      fetchEmployees();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/auth/listuser");
      const filtered = res.data.filter((e) => e.role !== "Admin");
      setEmployees(filtered);
    } catch (err) {
      console.log("Employee fetch error:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.log("Fetch tasks error:", err?.response?.data || err);
    }
  };

  const openAddTaskModal = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setEditingId(null);
    setComment("");
    setTitleError("");
    setDescriptionError("");
    setAssignedError("");
    setFormModalVisible(true);
  };

  const validateAssignedUser = (username) => {
    return employees.some(
      (emp) => emp.username.toLowerCase() === username.toLowerCase()
    );
  };

  const handleAddTask = async () => {
    let valid = true;
    setTitleError("");
    setDescriptionError("");
    setAssignedError("");

    if (!title.trim()) {
      setTitleError("Please enter the title");
      valid = false;
    }
    if (!description.trim()) {
      setDescriptionError("Please enter the description");
      valid = false;
    }
    if (!assignedTo.trim()) {
      setAssignedError("Please enter the assigned user");
      valid = false;
    } else if (!validateAssignedUser(assignedTo.trim())) {
      setAssignedError("This user does not exist in Employee List");
      valid = false;
    }

    if (!valid) return;

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_user_name: assignedTo.trim(),
        assigned_to: null,
        comment: comment.trim(),
        status: "Pending",
      };

      await createTask(data);
      await fetchTasks();

      setFormModalVisible(false);
      showSnackbar("Task Added Successfully !");
    } catch (err) {
      console.log("Add task error:", err?.response?.data || err);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assigned_user_name || "");
    setComment(task.comment || "");
    setFormModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const data = {
        title,
        description,
        assigned_user_name: assignedTo,
        comment,
        status: "Pending",
      };

      await updateTask(editingId, data);
      await fetchTasks();

      setEditingId(null);
      setFormModalVisible(false);
      showSnackbar("Saved Successfully !");
    } catch (err) {
      console.log("Update task error:", err?.response?.data || err);
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
      showSnackbar("Task Deleted Successfully !");
    } catch (err) {
      console.log("Delete task error:", err?.response?.data || err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#009688" }}>
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

      <Text style={styles.pageHeading}>Tasks</Text>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          onPress={openAddTaskModal}
          style={styles.addButtonTopRight}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tableBody}>
        {tasks.map((task) => (
          <Card key={task.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.headingText}>
                Title: {task.title}
              </Text>
              <Text>Description: {task.description}</Text>
              <Text>
                Assigned: {task.assigned_user_name || "Not Assigned"}
              </Text>
              <Text>Status: {task.status || "Pending"}</Text>
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => handleEditClick(task)}>Edit</Button>
              <Button onPress={() => openDeleteModal(task.id)}>
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageHeading: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  addButtonContainer: {
    alignItems: "flex-end",
    margin: 10,
  },
  addButtonTopRight: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  addButtonText: {
    fontWeight: "bold",
  },
  tableBody: {
    padding: 10,
  },
  card: {
    marginVertical: 8,
  },
  snackbarContainer: {
    position: "absolute",
    top: 60,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
  },
  snackbar: {
    backgroundColor: "#fff",
  },
  snackbarText: {
    color: "green",
  },
  headingText: {
    fontWeight: "bold",
  },
});

export default ManageTasks;
