import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, BackHandler } from "react-native";
import { Title, Button } from "react-native-paper";
import TaskCard from "../components/TasksCard";
import { AuthContext } from "../context/AuthContext";
import { getEmployeeTasks } from "../api/api";
import { confirmLogout } from "../utils/logoutHelper";

const EmployeeDashboard = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await getEmployeeTasks(user.id);
      setTasks(res.data || []);
      console.log("✅ Tasks fetched:", res.data);
    } catch (e) {
      console.log("❌ Fetch tasks error:", e);
    }
  };

  // ✅ Ye function child (TaskCard) se call hoga jab status update hota hai
  const handleTaskUpdated = () => {
    // Thoda delay de ke fetchTasks call karna (DB update hone ka time mile)
    setTimeout(() => {
      fetchTasks();
    }, 800);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>My Tasks</Title>

      {tasks.length === 0 ? (
        <Title style={{ textAlign: "center", color: "#666", marginTop: 20 }}>
          No tasks assigned yet.
        </Title>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdated={handleTaskUpdated} />
        ))
      )}

      <Button
        mode="outlined"
        style={styles.logoutButton}
        onPress={() => confirmLogout(logout, navigation)}
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#e8f0fe", flexGrow: 1 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 20,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 30,
    borderColor: "#6200ee",
    borderWidth: 2,
    paddingVertical: 6,
  },
});

export default EmployeeDashboard;
