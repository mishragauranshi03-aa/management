import React, { useState, useEffect } from "react";
import { Card, Button, Paragraph, TextInput } from "react-native-paper";
import { StyleSheet, Alert } from "react-native";
import { updateTask } from "../api/api";

const TasksCard = ({ task, onUpdated }) => {
  const [status, setStatus] = useState(task?.status ?? "Pending");
  const [comment, setComment] = useState(task?.comment || "");

  //  Parent se status aaye to update karo
  useEffect(() => {
    if (task?.status) setStatus(task.status);
  }, [task?.status]);

  const updateStatus = async () => {
    console.log(" Click hua:", status);

    let newStatus = "Pending";
    if (status === "Pending") newStatus = "In Progress";
    else if (status === "In Progress") newStatus = "Completed";

    try {
      await updateTask(task.id, { ...task, status: newStatus });
      console.log(" Status updated in backend");

      setStatus(newStatus);

      setTimeout(() => {
        if (onUpdated) onUpdated();
      }, 800);
    } catch (err) {
      console.log("Update Error:", err?.message);
      Alert.alert("Error", "Status update failed");
    }
  };

  //  NEW — Comment Update Function
  const updateComment = async () => {
    try {
      await updateTask(task.id, { ...task, comment });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.log(" Comment Update Error:", err?.message);
      Alert.alert("Error", "Comment update failed");
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Paragraph style={styles.title}>{task.title}</Paragraph>
        <Paragraph>{task.description}</Paragraph>
        <Paragraph>Status: {status}</Paragraph>

        {/*  COMMENT INPUT */}
        <TextInput
          label="Comment"
          value={comment}
          onChangeText={setComment}
          mode="outlined"
          style={{ marginTop: 10 }}
        />
      </Card.Content>

      <Card.Actions>
        {status !== "Completed" && (
          <>
            {/* NEXT STATUS BUTTON */}
            <Button
              mode="contained"
              onPress={updateStatus}
              style={styles.button}
              labelStyle={{ fontWeight: "bold" }}
            >
              Next Status
            </Button>

            {/* SAVE COMMENT BUTTON (with spacing) */}
            <Button
              mode="contained"
              onPress={updateComment}
              style={[styles.button, { marginLeft: 10 }]}  
              labelStyle={{ fontWeight: "bold" }}
            >
              Save Comment
            </Button>
          </>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 15, marginVertical: 8, padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", color: "#6200ee" },
  button: { borderRadius: 30, paddingHorizontal: 10, backgroundColor: "#6200ee" },
});

export default TasksCard;
