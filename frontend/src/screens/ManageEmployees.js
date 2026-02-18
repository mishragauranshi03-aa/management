import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  TextInput,
  Button,
  Text,
  Title,
  Snackbar,
  Modal,
  Portal,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { deleteUser, updateUser } from "../api/api";

const STORAGE_KEY = "EMPLOYEE_LIST";

const ManageEmployees = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");

  const [editingId, setEditingId] = useState(null);

  const [formModal, setFormModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadEmployees = async () => {
        try {
          const resp = await api.get("/auth/listuser");
          const filtered = resp.data.filter((emp) => emp.role !== "Admin");
          setEmployees(filtered);
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(filtered)
          );
        } catch (err) {
          console.log("Fetch employees error:", err);
        }
      };
      loadEmployees();
    }, [])
  );

  const showSnackbar = (msg) => {
    setSnackbarMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  const addEmployee = async () => {
    if (!email || !password) return;

    try {
      const data = { username, email, password, role };
      const resp = await api.post("/auth/createuser", data);

      const updated = [...employees, resp.data];
      setEmployees(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      resetForm();
      showSnackbar("User Added Successfully!");
    } catch (err) {
      console.log("Add employee error:", err);
    }
  };

  const handleEditClick = (emp) => {
    setEditingId(emp.id);
    setUsername(emp.username);
    setEmail(emp.email);
    setPassword("");
    setRole(emp.role);
    setFormModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const payload = password
        ? { username, email, password, role }
        : { username, email, role };

      await updateUser(editingId, payload);

      const updated = employees.map((emp) =>
        emp.id === editingId ? { ...emp, ...payload } : emp
      );

      setEmployees(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      resetForm();
      showSnackbar("Saved Successfully!");
    } catch (err) {
      console.log("Update employee error:", err);
    }
  };

  const handleDeleteEmployee = (id) => {
    setSelectedUserId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);

      const updated = employees.filter(
        (emp) => emp.id !== selectedUserId
      );
      setEmployees(updated);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setDeleteModalVisible(false);
      showSnackbar("User Deleted Successfully!");
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("Employee");
    setFormModal(false);
  };

  return (
    <ScrollView style={styles.screen}>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>

      <Title style={styles.pageTitle}>Employee List</Title>

      <Button
        mode="contained"
        onPress={() => setFormModal(true)}
        style={styles.addButton}
      >
        + Add Employee
      </Button>

      {employees.map((emp) => (
        <Card key={emp.id} style={styles.card}>
          <Card.Content>
            <Text>Username: {emp.username}</Text>
            <Text>Email: {emp.email}</Text>
            <Text>Role: {emp.role}</Text>
          </Card.Content>

          <Card.Actions>
            <Button onPress={() => handleEditClick(emp)}>
              Edit
            </Button>
            <Button onPress={() => handleDeleteEmployee(emp.id)}>
              Delete
            </Button>
          </Card.Actions>
        </Card>
      ))}

      {/* Add/Edit Modal */}
      <Portal>
        <Modal
          visible={formModal}
          onDismiss={() => setFormModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>
            {editingId ? "Edit Employee" : "Add Employee"}
          </Title>

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="Role"
            value={role}
            onChangeText={setRole}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={editingId ? handleSaveEdit : addEmployee}
          >
            Save
          </Button>
        </Modal>
      </Portal>

      {/* Delete Modal */}
      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text>Are you sure you want to delete?</Text>

          <Button onPress={confirmDelete}>Yes</Button>
          <Button onPress={() => setDeleteModalVisible(false)}>
            No
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 10, backgroundColor: "#eef3fa" },
  pageTitle: { fontSize: 28, textAlign: "center", marginBottom: 10 },
  addButton: { marginBottom: 15 },
  card: { marginBottom: 10 },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  input: { marginBottom: 10 },
});

export default ManageEmployees;
