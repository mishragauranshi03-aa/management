import React, { useState } from 'react';
import { Card, Button, Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';
//import api from '../api/api';
import { updateTask } from '../api/api';


const TasksCard = ({ task, onUpdated }) => {
  const [status, setStatus] = useState(task.status);

  const updateStatus = async () => {
    console.log("Next Status button clicked ✅");  // 👈 add this line
    let newStatus = status;
    if (status === "Pending") newStatus = "In Progress";
    else if (status === "In Progress") newStatus = "Completed";
    try {
    //  const resp = await api.put(/tasks/${task.id}, { status: newStatus });
     //  Use updateTask function
    const resp = await updateTask(task.id, { status: newStatus || "Pending", title: task.title || "", description: task.description || "", assigned_to: task.assigned_to || 0});
    setStatus(resp.data.status || newStatus);

      //if (onUpdated) onUpdated(resp.data);
      if (onUpdated) onUpdated();  // pass data nahi

    } catch (err) {
      console.log("Update task error", err?.response?.data || err);
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
        {status !== "Completed" && <Button onPress={updateStatus} style={styles.button}>Next Status</Button>}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#6200ee' },
  button: { borderRadius: 30, paddingHorizontal: 10 }
});

export default TasksCard;