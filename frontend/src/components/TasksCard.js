import React, { useState, useEffect } from 'react';
import { Card, Button, Paragraph } from 'react-native-paper';
import { StyleSheet, Alert } from 'react-native';
import { updateTask } from '../api/api';

const TasksCard = ({ task, onUpdated }) => {
  const [status, setStatus] = useState(task.status || "Pending");

  // ✅ जब parent से नया status आये तो update करो
  useEffect(() => {
    if (task?.status) {
      setStatus(task.status);
    }
  }, [task?.status]);

  const updateStatus = async () => {
    let newStatus = "Pending";
    if (status === "Pending") newStatus = "In Progress";
    else if (status === "In Progress") newStatus = "Completed";

    try {
      const resp = await updateTask(task.id, {
        ...task,
        status: newStatus,
      });
      console.log("UPDATE RESPONSE:", resp.data);

      setStatus(resp.data.status || newStatus);
      if (onUpdated) onUpdated(); // refresh parent list if needed

    } catch (err) {
      console.log("❌ Update Error:", err?.response?.data || err.message);
      Alert.alert("Error", err?.response?.data?.detail || "Update failed");
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Paragraph style={styles.title}>{task.title}</Paragraph>
        <Paragraph>{task.description}</Paragraph>
        <Paragraph>Status: {status}</Paragraph>
      </Card.Content>
      <Card.Actions>
        {status !== "Completed" && (
          <Button onPress={updateStatus} style={styles.button}>
            Next Status
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 15, marginVertical: 8, padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#6200ee' },
  button: { borderRadius: 30, paddingHorizontal: 10 },
});

export default TasksCard;
