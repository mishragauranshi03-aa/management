import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import { Card, TextInput, Button, Text, Title, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTasks, createTask, deleteTask, updateTask } from "../api/api";

//  ADDED: Employees fetch
import api from "../api/api";

const STORAGE_KEY = "@tasks_list";

const ManageTasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  //  ADDED: Employees list
  const [employees, setEmployees] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [editingId, setEditingId] = useState(null);

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
      fetchEmployees();  //  ADDED
    });
    return unsubscribe;
  }, [navigation]);

  //  Fetch Employees
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
    setTitleError("");
    setDescriptionError("");
    setAssignedError("");
    setFormModalVisible(true);
  };

  // ---------------------------
  //  CHECK IF USER EXISTS
  const validateAssignedUser = (username) => {
    return employees.some((emp) => emp.username.toLowerCase() === username.toLowerCase());
  };
  // ---------------------------

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
    } 
    //  NEW VALIDATION
    else if (!validateAssignedUser(assignedTo.trim())) {
      setAssignedError("This user does not exist in Employee List");
      valid = false;
    }

    if (!valid) return;

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_user_name: assignedTo.trim(),
        status: "Pending",
      };

      await createTask(data);
      await fetchTasks();

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setFormModalVisible(false);

      showSnackbar("Task Added Successfully ! ✅");
    } catch (err) {
      console.log("Add task error:", err?.response?.data || err);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assigned_user_name || "");
    setTitleError("");
    setDescriptionError("");
    setAssignedError("");
    setFormModalVisible(true);
  };

  const handleSaveEdit = async () => {
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
    } 
    //  NEW VALIDATION
    else if (!validateAssignedUser(assignedTo.trim())) {
      setAssignedError("This user does not exist in Employee List");
      valid = false;
    }

    if (!valid) return;

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_user_name: assignedTo.trim(),
        status: "Pending",
      };

      await updateTask(editingId, data);
      await fetchTasks();

      setEditingId(null);
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setFormModalVisible(false);

      showSnackbar("Saved Successfully ! ✔");
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
      showSnackbar("Task Deleted Successfully ! ✔");
    } catch (err) {
      console.log("Delete task error:", err?.response?.data || err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#009688" }}>
      {/* ORIGINAL UI BELOW — NOTHING CHANGED */}

      {/* SNACKBAR */}
      <View style={styles.snackbarContainer}>
        <Snackbar visible={visible} onDismiss={() => setVisible(false)} duration={2000} style={styles.snackbar}>
          <Text style={styles.snackbarText}>{snackbarMessage}</Text>
        </Snackbar>
      </View>

      {/* DELETE MODAL */}
      <Modal transparent visible={deleteModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteBox}>
            <View style={styles.topRow}>
              <Text style={styles.warningIcon}></Text>
            </View>

            <Text style={styles.deleteHeading}>
             ⚠ Are you sure you want to{"\n"}delete?
            </Text>

            <View style={styles.deleteButtonsRow}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.noButton}>
                <Text style={styles.noButtonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmDelete} style={styles.yesButton}>
                <Text style={styles.yesButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FORM MODAL */}
      <Modal transparent visible={formModalVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Title style={styles.modalTitleText}>{editingId ? "Edit Task" : "Add Task"}</Title>

            <View style={styles.inputWrapper}>
              <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
              {titleError ? <Text style={styles.errorMsg}>{titleError}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" />
              {descriptionError ? <Text style={styles.errorMsg}>{descriptionError}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Assign To (Username)" value={assignedTo} onChangeText={setAssignedTo} style={styles.input} mode="outlined" />
              {assignedError ? <Text style={styles.errorMsg}>{assignedError}</Text> : null}
            </View>

            <View style={styles.modalButtonRow}>
              <Button mode="contained" style={styles.saveButton} labelStyle={{ fontSize: 18, fontWeight: "bold" }} onPress={editingId ? handleSaveEdit : handleAddTask}>
                {editingId ? "Save" : "Add"}
              </Button>

              <Button mode="outlined" style={styles.cancelButton} labelStyle={{ fontSize: 18, fontWeight: "bold" }} onPress={() => { setFormModalVisible(false); setEditingId(null); }}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Page Heading */}
      <Text style={styles.pageHeading}>Tasks Cards</Text>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={openAddTaskModal} style={styles.addButtonTopRight}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* TASK LIST */}
      <ScrollView style={styles.tableBody}>
        {tasks.map((task) => (
          <Card key={task.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.headingText}>
                Title: <Text style={styles.headingValue}>{task.title}</Text>
              </Text>
              <Text style={styles.headingText}>
                Description: <Text style={styles.headingValue}>{task.description}</Text>
              </Text>
              <Text style={styles.headingText}>
                Assigned User: <Text style={styles.headingValue}>{task.assigned_user_name || "Not Assigned"}</Text>
              </Text>
              <Text style={styles.headingText}>
                Status: <Text style={styles.headingValue}>{task.status || "Pending"}</Text>
              </Text>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <Button mode="outlined" style={styles.editButton} onPress={() => handleEditClick(task)} textColor="#fff">
                Edit
              </Button>
              <Button mode="contained" style={styles.deleteButton} onPress={() => openDeleteModal(task.id)}>
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
  mainContainer: { flex: 1, padding: 20, backgroundColor: "#e8f0fe" },

  pageHeading: {
    fontSize: 40,
    fontWeight: "bold",
    color: '#ffffff',
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  addButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  addButtonTopRight: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },

  snackbarContainer: { position: "absolute", top: 80, width: "100%", alignItems: "center", zIndex: 100 },
  snackbar: { backgroundColor: "#ffffff", borderRadius: 12, elevation: 5, paddingHorizontal: 25, paddingVertical: 15 },
  snackbarText: { color: "green", fontSize: 20, fontWeight: "900", textAlign: "center" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },

  deleteBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginHorizontal : 40,
    elevation :10,
    alignSelf: "center",
  },
  topRow: { width: "100%", alignItems: "flex-start", marginBottom: 6 },
  warningIcon: { fontSize: 36, marginLeft: 12, marginBottom: 6 },
  deleteHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 34,
  },
  deleteButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
  },
  tableBody: { marginTop: 5, height:500 },

  noButton: {
    width: "48%",
    backgroundColor: "#bdbdbd",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  yesButton: {
    width: "48%",
    backgroundColor: "#d32f2f",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  noButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  yesButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  modalBox: { width: 900, height: 500, backgroundColor: "#fff", paddingVertical: 70, paddingHorizontal: 55, borderRadius: 14, elevation: 10, alignItems: "center" },
  modalTitleText: { fontSize: 48, fontWeight: "bold", marginBottom: 45, color: '#8B4513' },
  modalButtonRow: { flexDirection: "row", justifyContent: "center", marginTop: 15, width: "100%" },

  saveButton: {
    backgroundColor: "#6200ee",
    width: 150,
    height: 65,
    justifyContent: "center",
    borderRadius: 25,
    marginRight: 5,
  },
  cancelButton: {
    borderColor: "#6200ee",
    borderWidth: 2,
    width: 150,
    height: 65,
    justifyContent: "center",
    borderRadius: 25,
    marginLeft: 5,
  },

  inputWrapper: {
    width: "90%",
    marginBottom: 20,
  },
  input: { backgroundColor: "#fff" }, //  No red border
  errorMsg: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 4,
    marginLeft: 12,
  },

  card: { marginVertical: 8, borderRadius: 40, elevation: 5, backgroundColor: '#f5f5f5', padding: 10 },
  editButton: { backgroundColor: "#4CAF50", marginRight: 5 },
  deleteButton: { backgroundColor: "#d32f2f" },

  headingText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0057FF",
    marginBottom: 6,
  },
  headingValue: {
    fontSize: 15,
    color: "#000",
    fontWeight: "normal",
  },

  cardActions: {
    marginTop: -45,
    justifyContent: "flex-end",
  },
});


export default ManageTasks;
