import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { Card, Button, Paragraph, Text, Menu } from "react-native-paper";
=======
import { Card, Button, Paragraph, TextInput } from "react-native-paper";
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
import { StyleSheet, Alert } from "react-native";
import { updateTask } from "../api/api";

const TasksCard = ({ task, onUpdated }) => {
  const [status, setStatus] = useState(task?.status ?? "Pending");
<<<<<<< HEAD
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
=======
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
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
<<<<<<< HEAD
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
=======
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
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  card: { borderRadius: 15, marginVertical: 8, padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", color: "#6200ee" },
  button: { borderRadius: 30, paddingHorizontal: 10, backgroundColor: "#6200ee" },
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
});

export default TasksCard;
