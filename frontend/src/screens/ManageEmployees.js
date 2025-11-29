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
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formModal, setFormModal] = useState(false);

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
          const filtered = resp.data.filter(emp => emp.role !== "Admin");
          setEmployees(filtered);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (err) {
          console.log("Fetch employees error:", err?.response?.data || err);
        }
      };
      loadAndFetch();
    }, [])
  );

  const specialCharPattern = /[^\w\s@.]/;

  const validateForm = () => {
    let valid = true;
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setRoleError("");

    if (!username.trim()) {
      setUsernameError("Please enter the username");
      valid = false;
    } else if (specialCharPattern.test(username)) {
      setUsernameError("Username contains invalid characters");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Please enter the email");
      valid = false;
    } else if (!email.toLowerCase().endsWith("@gmail.com")) {
      setEmailError("Only @gmail.com email addresses are allowed");
      valid = false;
    } else if (specialCharPattern.test(email.replace(/@|\./g, ""))) {
      setEmailError("Email contains invalid characters");
      valid = false;
    }

    if (!password.trim() && !editingId) {
      setPasswordError("Please enter the password");
      valid = false;
    } else if (specialCharPattern.test(password)) {
      setPasswordError("Password contains invalid characters");
      valid = false;
    }

    if (!role.trim() || role.toLowerCase() === "admin") {
      setRoleError("Please enter a valid role (not Admin)");
      valid = false;
    } else if (specialCharPattern.test(role)) {
      setRoleError("Role contains invalid characters");
      valid = false;
    }

    return valid;
  };

  //  DUPLICATE EMAIL VALIDATION ADDED HERE ONLY 
  const addEmployee = async () => {
    if (!validateForm()) return;

    const emailAlreadyExists = employees.some(
      (emp) => emp.email.toLowerCase() === email.toLowerCase()
    );

    if (emailAlreadyExists) {
      setEmailError("This email already exists");
      return; //  FORM SAVE NAHI HOGA
    }

    try {
      const data = { username, email, password, role };
      const resp = await api.post("/auth/createuser", data);
      setEmployees((prev) => [...prev, resp.data]);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...employees, resp.data])
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("Employee");
      setFormModal(false);

      showSnackbar("User Added Successfully ! ✅");
    } catch (err) {
      console.log("Add employee error:", err?.response?.data || err);
    }
  };

  const handleEditClick = (emp) => {
    setEditingId(emp.id);
    setUsername(emp.username);
    setEmail(emp.email);
    setPassword("");
    setRole(emp.role);
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setRoleError("");
    setFormModal(true);
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;

    try {
      const existingEmp = employees.find((e) => e.id === editingId);
      const payload = password
        ? { username, email, password, role }
        : { username, email, role, password: existingEmp?.password };

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
      setFormModal(false);
    } catch (err) {
      console.log("Update employee error:", err?.response?.data || err);
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
      setSelectedUserId(null);
      showSnackbar("User Deleted Successfully ! ✅");
    } catch (err) {
      console.log("Confirm delete error:", err);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  return (
    <ScrollView style={styles.screen}>
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

      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.deleteModal}
        >
          <Text style={styles.deleteTitle}>
            ⚠️ Are you sure you want to delete?
          </Text>

          <View style={styles.deleteButtons}>
            <Button
              mode="contained"
              onPress={() => setDeleteModalVisible(false)}
              style={styles.noBtn}
            >
              No
            </Button>

            <Button
              mode="contained"
              onPress={confirmDelete}
              style={styles.yesBtn}
            >
              Yes
            </Button>
          </View>
        </Modal>
      </Portal>

      <View style={styles.topBar}>
        <Title style={styles.pageTitle}>Employee List</Title>
        <Button
          mode="contained"
          onPress={() => {
            setEditingId(null);
            setUsername("");
            setEmail("");
            setPassword("");
            setRole("Employee");
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
            setRoleError("");
            setFormModal(true);
          }}
          style={styles.addButton}
          labelStyle={{ fontWeight: "bold", color: "#fff" }}
        >
          + Add Employee
        </Button>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.thID}>S.No.</Text>
        <Text style={styles.thUsername}>Username</Text>
        <Text style={styles.thEmail}>Email</Text>
        <Text style={styles.thRole}>Role</Text>
        <Text style={styles.thActions}>Actions</Text>
      </View>

      <ScrollView style={styles.tableBody}>
        {employees.map((emp, index) => (
          <View key={emp.id} style={styles.tableRow}>
            <Text style={styles.tdID}>{index + 1}</Text>
            <Text style={styles.tdUsername}>{emp.username}</Text>
            <Text style={styles.tdEmail}>{emp.email}</Text>
            <Text style={styles.tdRole}>{emp.role}</Text>
            <View style={styles.actionBox}>
              <Button
                mode="outlined"
                onPress={() => handleEditClick(emp)}
                style={styles.editBtn}
                textColor="#fff"
              >
                Edit
              </Button>
              <Button
                mode="contained"
                onPress={() => handleDeleteEmployee(emp.id)}
                style={styles.deleteBtn}
              >
                Delete
              </Button>
            </View>
          </View>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={formModal}
          onDismiss={() => setFormModal(false)}
          contentContainerStyle={styles.formModal}
        >
          <View style={styles.formTitleBox}>
            <Text style={styles.formTitle}>
              {editingId ? "Edit Employee" : "Add Employee"}
            </Text>
          </View>

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.inp}
            mode="outlined"
          />
          {usernameError ? <Text style={styles.errText}>{usernameError}</Text> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.inp}
            mode="outlined"
          />
          {emailError ? <Text style={styles.errText}>{emailError}</Text> : null}

          <TextInput
            label={editingId ? "Password (leave blank to keep same)" : "Password"}
            value={password}
            onChangeText={setPassword}
            style={styles.inp}
            mode="outlined"
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errText}>{passwordError}</Text> : null}

          <TextInput
            label="Role"
            value={role}
            onChangeText={setRole}
            style={styles.inp}
            mode="outlined"
          />
          {roleError ? <Text style={styles.errText}>{roleError}</Text> : null}

          <View style={styles.modalBtns}>
            <Button mode="text" onPress={() => setFormModal(false)}>Cancel</Button>
            <Button mode="contained" onPress={editingId ? handleSaveEdit : addEmployee}>Save</Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#eef3fa", padding: 10 },
  topBar: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pageTitle: { fontSize: 40, fontWeight: "bold", color: "#333", marginBottom: 10 },
  addButton: { backgroundColor: "#5b8dfd", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, alignSelf: "flex-end", marginBottom: 10 },
  tableHeader: { flexDirection: "row", backgroundColor: "#009688", padding: 12, borderRadius: 8 },
  thID: { width: "15%", fontWeight: "bold", fontSize: 25, color: "#f5f5f5" },
  thUsername: { width: "25%", fontWeight: "bold", fontSize: 25, color: "#f5f5f5" },
  thEmail: { width: "30%", fontWeight: "bold", fontSize: 25, color: "#f5f5f5" },
  thRole: { width: "15%", fontWeight: "bold", fontSize: 25, color: "#f5f5f5" },
  thActions: { width: "15%", fontWeight: "bold", fontSize: 25, textAlign: "right", color: "#f5f5f5" },
  tableBody: { marginTop: 5, height: 500 },
  tableRow: { flexDirection: "row", padding: 12, backgroundColor: "#fff", marginBottom: 8, borderRadius: 8, elevation: 2 },
  tdID: { width: "15%", fontSize: 20 },
  tdUsername: { width: "25%", fontSize: 20 },
  tdEmail: { width: "30%", fontSize: 20 },
  tdRole: { width: "15%", fontSize: 20 },
  actionBox: { width: "15%", flexDirection: "row", justifyContent: "flex-end" },
  editBtn: { backgroundColor: "#4CAF50", marginRight: 5 },
  deleteBtn: { backgroundColor: "#d32f2f" },
  formModal: { width: "30%", height: 500, alignSelf: "center", backgroundColor: "#fff", padding: 80, borderRadius: 12, elevation: 10 },
  formTitleBox: { marginBottom: 20 },
  formTitle: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 35, color: '#8B4513'},
  inp: { marginBottom: 10, backgroundColor: "#fff" },
  errText: { color: "red", fontWeight: "bold", marginBottom: 5, alignSelf: "flex-start" },
  modalBtns: { marginTop: 20, flexDirection: "row", justifyContent: "space-between" },
  deleteModal: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: 300, alignSelf: "center" },
  deleteTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  deleteButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 25 },
  noBtn: { backgroundColor: "#777", width: "45%" },
  yesBtn: { backgroundColor: "#d32f2f", width: "45%" },
  snackbarContainer: { position: "absolute", top: 70, width: "100%", alignItems: "center", zIndex: 100 },
  snackbar: { backgroundColor: "#ffffff", borderRadius: 12, elevation: 5, paddingHorizontal: 25, paddingVertical: 15 },
  snackbarText: { color: "green", fontSize: 20, fontWeight: "900", textAlign: "center" },
});

export default ManageEmployees;
