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
  const [comment, setComment] = useState("");


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

<<<<<<< HEAD
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
=======
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchTasks);
    return unsubscribe;
  }, [navigation]);
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.log("Fetch tasks error:", err?.response?.data || err);
    }
  };

<<<<<<< HEAD
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

=======
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
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
<<<<<<< HEAD
        assigned_user_name: assignedTo.trim(),
=======
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
        comment: comment.trim(),
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
        status: "Pending",
      };

      await createTask(data);
      await fetchTasks();

      setTitle("");
      setDescription("");
      setAssignedTo("");
<<<<<<< HEAD
      setFormModalVisible(false);
=======
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105

      showSnackbar("Task Added Successfully ! ✅");
    } catch (err) {
      console.log("Add task error:", err?.response?.data || err);
    }
  };

<<<<<<< HEAD
=======
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

>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
<<<<<<< HEAD
    setAssignedTo(task.assigned_user_name || "");
    setTitleError("");
    setDescriptionError("");
    setAssignedError("");
    setFormModalVisible(true);
=======
    setAssignedTo(String(task.assigned_to || ""));
    setComment(task.comment || "");

>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
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
<<<<<<< HEAD
        assigned_user_name: assignedTo.trim(),
=======
        assigned_to: parseInt(assignedTo) || null,
        comment: comment.trim(),
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
        status: "Pending",
      };

      await updateTask(editingId, data);
      await fetchTasks();

      setEditingId(null);
      setTitle("");
      setDescription("");
      setAssignedTo("");
<<<<<<< HEAD
      setFormModalVisible(false);

      showSnackbar("Saved Successfully ! ✔");
=======

      showSnackbar("Saved Successfully ! ✅");
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
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
<<<<<<< HEAD
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
              ⚠️ Are you sure you want to{"\n"}delete?
            </Text>

            <View style={styles.deleteButtonsRow}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.noButton}>
                <Text style={styles.noButtonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmDelete} style={styles.yesButton}>
                <Text style={styles.yesButtonText}>Yes</Text>
=======
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
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

<<<<<<< HEAD
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
=======
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

        <TextInput
          label="Comment"
          value={comment}
          onChangeText={setComment}
          style={styles.input}
          mode="outlined"
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
              <Text style={styles.cardSubtitle}>Comment: {task.comment}</Text>
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
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}
<<<<<<< HEAD
=======

        <Button mode="outlined" style={styles.backButton} onPress={() => navigation.goBack()}>
          Back
        </Button>
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  mainContainer: { flex: 1, padding: 20, backgroundColor: "#e8f0fe" },

  pageHeading: {
    fontSize: 40,
=======
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
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
    fontWeight: "bold",
    color: '#ffffff',
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
<<<<<<< HEAD
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
=======
  input: { marginBottom: 10, backgroundColor: "#fff" },
  addButton: { marginBottom: 20, borderRadius: 30, backgroundColor: "#6200ee" },
  card: {
    marginVertical: 8,
    borderRadius: 15,
    elevation: 5,
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginHorizontal : 40,
    elevation :10,
    alignSelf: "center",
  },
<<<<<<< HEAD
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
=======
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#6200ee" },
  cardSubtitle: { fontSize: 14, color: "#333" },
  statusText: { fontSize: 15, fontWeight: "bold", color: "#1a73e8", marginTop: 5 },
  editButton: { backgroundColor: "#4CAF50", marginRight: 5 },
  deleteButton: { backgroundColor: "#d32f2f" },
  backButton: {
    marginTop: 20,
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
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

<<<<<<< HEAD

export default ManageTasks;
=======
export default ManageTasks;
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
