import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Paragraph,
  Text,
  Menu,
  TextInput,
} from "react-native-paper";
import { StyleSheet, Alert } from "react-native";
import { updateTask } from "../api/api";

const TasksCard = ({ task, onUpdated }) => {
  const [status, setStatus] = useState(task?.status ?? "Pending");
  const [menuVisible, setMenuVisible] = useState(false);
  const [comment, setComment] = useState(task?.comment || "");

  // Parent se updated task aaye to sync karo
  useEffect(() => {
    if (task?.status) setStatus(task.status);
    if (task?.comment) setComment(task.comment);
  }, [task]);

  // Status update function
  const updateStatus = async (newStatus) => {
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      setStatus(newStatus);
      setMenuVisible(false);

      if (onUpdated) onUpdated();
    } catch (err) {
      console.log("Status Update Error:", err?.message);
      Alert.alert("Error", "Status update failed");
    }
  };

  // Comment update function
  const updateComment = async () => {
    try {
      await updateTask(task.id, { ...task, comment });
      if (onUpdated) onUpdated();
      Alert.alert("Success", "Comment saved");
    } catch (err) {
      console.log("Comment Update Error:", err?.message);
      Alert.alert("Error", "Comment update failed");
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

        {/* Comment Input */}
        <TextInput
          label="Comment"
          value={comment}
          onChangeText={setComment}
          mode="outlined"
          style={{ marginTop: 10 }}
        />
      </Card.Content>

      <Card.Actions>
        {/* Status Dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={styles.button}
            >
              Change Status ▼
            </Button>
          }
        >
          <Menu.Item onPress={() => updateStatus("Pending")} title="Pending" />
          <Menu.Item onPress={() => updateStatus("In Progress")} title="In Progress" />
          <Menu.Item onPress={() => updateStatus("Completed")} title="Completed" />
        </Menu>

        {/* Save Comment Button */}
        <Button
          mode="contained"
          onPress={updateComment}
          style={[styles.button, { marginLeft: 10 }]}
        >
          Save Comment
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginVertical: 8,
    padding: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#6200ee",
    fontSize: 16,
  },
  value: {
    fontSize: 15,
    color: "#000",
  },
  row: {
    marginBottom: 10,
  },
  button: {
    borderRadius: 25,
    backgroundColor: "#6200ee",
  },
});

export default TasksCard;
