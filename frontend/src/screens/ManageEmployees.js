import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, TextInput, Button, Text, Title } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { deleteUser, updateUser } from "../api/api";

const STORAGE_KEY = "EMPLOYEE_LIST";

const ManageEmployees = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [editingId, setEditingId] = useState(null);

  // ✅ Screen setup
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

  // ✅ Load all users from backend
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

  // ✅ Add new employee/admin
  const addEmployee = async () => {
    if (!email || !password) return alert("Please enter email and password");
    try {
      const data = { email, password, role };
      const resp = await api.post("/auth/createuser", data);
      setEmployees((prev) => [...prev, resp.data]);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...employees, resp.data]));
      setEmail("");
      setPassword("");
      setRole("Employee");
    } catch (err) {
      console.log("Add employee error:", err?.response?.data || err);
    }
  };

  // ✅ Delete employee
  const handleDeleteEmployee = async (id) => {
    try {
      await deleteUser(id);
      const updated = employees.filter((emp) => emp.id !== id);
      setEmployees(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.log("Delete employee error:", err?.response?.data || err);
    }
  };

  // ✅ Edit button clicked
  const handleEditClick = (emp) => {
    setEditingId(emp.id);
    setEmail(emp.email);
    setPassword(""); // reset password field for security
    setRole(emp.role);
  };

  // ✅ Save changes after editing
  const handleSaveEdit = async () => {
    try {
      const data = { email, password, role };
      await updateUser(editingId, data);

      const updated = employees.map((emp) =>
        emp.id === editingId ? { ...emp, email, role } : emp
      );

      setEmployees(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEditingId(null);
      setEmail("");
      setPassword("");
      setRole("Employee");
    } catch (err) {
      console.log("Update employee error:", err?.response?.data || err);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>
          {editingId ? "Edit Employee/Admin" : "Add Employee/Admin"}
        </Title>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Password"
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
              <Text style={styles.cardSubtitle}>Email: {emp.email}</Text>
              <Text style={styles.cardSubtitle}>Role: {emp.role}</Text>
              <Text style={styles.cardSubtitle}>ID: {emp.id}</Text>
            </Card.Content>

            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => handleEditClick(emp)}
                style={styles.editButton}
                textColor="#fff"
              >
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

// ---------- STYLES ----------
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
});

export default ManageEmployees;
