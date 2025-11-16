import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, TextInput, Button, Text, Title, Snackbar, Modal, Portal } from "react-native-paper";
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
  const [emailError, setEmailError] = useState("");

  // 🔥 NEW STATES (delete popup)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Manage Employees",
        headerBackTitleVisible: false,
      });
      return () => navigation.setOptions({ headerShown: false });
    }, [navigation])
  );

  useFocusEffect(
    useCallback(() => {
      const loadAndFetch = async () => {
        try {
          const resp = await api.get("/auth/listuser");
          setEmployees(resp.data);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resp.data));
        } catch (err) {
          console.log("Fetch employees error:", err?.response?.data || err);
        }
      };
      loadAndFetch();
    }, [])
  );

  const addEmployee = async () => {
    if (!email || !password) return alert("Please enter email and password");
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setEmailError("Only @gmail.com email addresses are allowed");
      return;
    }
    setEmailError("");

    try {
      const data = { username, email, password, role };
      const resp = await api.post("/auth/createuser", data);
      setEmployees((prev) => [...prev, resp.data]);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...employees, resp.data]));
      setEmail("");
      setPassword("");
      setRole("Employee");
      setUsername("");
      showSnackbar("User Added Successfully ! ✅");
    } catch (err) {
      console.log("Add employee error:", err?.response?.data || err);
    }
  };

  const handleDeleteEmployee = (id) => {
    setSelectedUserId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);

      const updated = employees.filter((emp) => emp.id !== selectedUserId);
      setEmployees(updated);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setDeleteModalVisible(false);

      showSnackbar("User Deleted Successfully ! ✅");
    } catch (err) {
      console.log("Confirm delete error:", err);
    }
  };

  const handleEditClick = (emp) => {
    setEditingId(emp.id);
    setUsername(emp.username);
    setEmail(emp.email);
    setPassword("");
    setRole(emp.role);
  };

  const handleSaveEdit = async () => {
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setEmailError("Only @gmail.com emails are allowed");
      return;
    }
    setEmailError("");

    try {
      const existingEmp = employees.find((e) => e.id === editingId);
      let payload;

      if (password && password.trim() !== "") {
        payload = { username, email, password, role };
      } else {
        payload = {
          username,
          email,
          password: existingEmp?.password || undefined,
          role,
        };
      }

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
      });

      await updateUser(editingId, payload);

      const updated = employees.map((emp) =>
        emp.id === editingId
          ? { ...emp, username, email, role, password: payload.password || emp.password }
          : emp
      );

      setEmployees(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setEditingId(null);
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("Employee");

      showSnackbar("Saved Successfully ! ✅");
    } catch (err) {
      console.log("Update employee error:", err?.response?.data || err);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  return (
    <View style={styles.screen}>
      {/* TOP SNACKBAR */}
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

      {/* 🔥 DELETE CONFIRMATION POPUP */}
      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modalBox}
        >
          <Text style={styles.modalTitle}>⚠️ Are you sure you want to delete?</Text>

          <View style={styles.modalButtons}>
            <Button mode="contained" onPress={() => setDeleteModalVisible(false)} style={styles.noBtn}>
              No
            </Button>

            <Button mode="contained" onPress={confirmDelete} style={styles.yesBtn}>
              Yes
            </Button>
          </View>
        </Modal>
      </Portal>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>
          {editingId ? "Edit Employee/Admin" : "Add Employee/Admin"}
        </Title>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
        />

        <View style={{ position: "relative" }}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (text.toLowerCase().endsWith("@gmail.com")) setEmailError("");
            }}
            style={styles.input}
            mode="outlined"
            error={!!emailError}
          />
          {emailError !== "" && <Text style={styles.insideErrorText}>Only @gmail.com allowed</Text>}
        </View>

        <TextInput
          label={editingId ? "Password (leave blank to keep same)" : "Password"}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        <TextInput
          label="Role (Admin/Employee)"
          value={role}
          onChangeText={setRole}
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="contained"
          style={styles.button}
          onPress={editingId ? handleSaveEdit : addEmployee}
        >
          {editingId ? "Save Changes" : "Add"}
        </Button>

        {employees.map((emp) => (
          <Card key={emp.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardSubtitle}>Username: {emp.username}</Text>
              <Text style={styles.cardSubtitle}>Email: {emp.email}</Text>
              <Text style={styles.cardSubtitle}>Role: {emp.role}</Text>
              <Text style={styles.cardSubtitle}>ID: {emp.id}</Text>
            </Card.Content>

            <Card.Actions>
              <Button mode="outlined" onPress={() => handleEditClick(emp)} style={styles.editButton} textColor="#fff">
                Edit
              </Button>

              <Button
                mode="contained"
                onPress={() => handleDeleteEmployee(emp.id)}
                style={styles.deleteButton}
              >
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
  screen: { flex: 1, backgroundColor: "#e8f0fe" },
  scrollView: { flex: 1 },
  scrollContainer: { padding: 16, paddingBottom: 100 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#6200ee", marginVertical: 5 },
  editButton: { backgroundColor: "#4CAF50", marginRight: 5 },
  deleteButton: { backgroundColor: "#d32f2f" },
  card: {
    marginVertical: 8,
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#fff",
    elevation: 5,
  },
  cardSubtitle: { fontSize: 14, color: "#333" },

  insideErrorText: {
    position: "absolute",
    right: 12,
    top: 20,
    color: "red",
    fontWeight: "900",
    fontSize: 16,
  },

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

  // 🔥 POPUP STYLES
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 12,
    elevation: 10,
    width: 300,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  noBtn: { backgroundColor: "#777", width: "45%" },
  yesBtn: { backgroundColor: "#d32f2f", width: "45%" },
});

export default ManageEmployees;
