import React, { useState, useEffect } from "react";
import { Card, Button, Paragraph, Text, Menu } from "react-native-paper";
import { StyleSheet, Alert } from "react-native";
import { updateTask } from "../api/api";

const TasksCard = ({ task, onUpdated }) => {
  const [status, setStatus] = useState(task?.status ?? "Pending");
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (task?.status) setStatus(task.status);
  }, [task?.status]);

  const updateStatus = async (newStatus) => {
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      setStatus(newStatus);
      setMenuVisible(false);

      setTimeout(() => {
        if (onUpdated) onUpdated();
      }, 500);
    } catch (err) {
      Alert.alert("Error", "Status update failed");
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Paragraph style={styles.row}>
          <Text style={styles.label}>Title: </Text>
          <Text style={styles.value}>{task.title}</Text>
        </Paragraph>

        <Paragraph style={styles.row}>
          <Text style={styles.label}>Description: </Text>
          <Text style={styles.value}>{task.description}</Text>
        </Paragraph>

        <Paragraph style={styles.row}>
          <Text style={styles.label}>Status: </Text>
          <Text style={styles.value}>{status}</Text>
        </Paragraph>
      </Card.Content>

      <Card.Actions>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={styles.button}
              labelStyle={{ fontWeight: "bold", fontSize: 18 }}
            >
              Status ▼
            </Button>
          }
        >
          <Menu.Item onPress={() => updateStatus("Pending")} title="Pending" />
          <Menu.Item onPress={() => updateStatus("In Progress")} title="In Progress" />
          <Menu.Item onPress={() => updateStatus("Completed")} title="Completed" />
        </Menu>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 45, marginVertical: 8, padding: 10 },
  label: { fontWeight: "bold", color: "#6200ee", fontSize: 18 },
  value: { fontSize: 17, color: "#000" },
  button: {
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#6200ee",
    marginTop: -50
  },
  row: { marginBottom: 12 }, //  only gap added here
});

export default TasksCard;
