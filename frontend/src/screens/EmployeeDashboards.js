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
  }, [user]); // refresh hone ke baad user milte hi tasks fetch ho jayenge

  const fetchTasks = async () => {
    try {
      const res = await getEmployeeTasks(user.id);
      setTasks(res.data || []);
    } catch (e) {
      console.log("Fetch tasks error:", e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>My Tasks</Title>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdated={fetchTasks} />
      ))}
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
