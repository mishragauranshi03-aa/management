import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, BackHandler } from 'react-native';
import { Title, Button } from 'react-native-paper';
import TaskCard from '../components/TasksCard';
import { AuthContext } from '../context/AuthContext';
import { getEmployeeTasks } from '../api/api';
import { confirmLogout } from '../utils/logoutHelper';

const EmployeeDashboard = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      //const resp = await getEmployeeTasks(user.id);
      const resp = await getEmployeeTasks(user.username);

      setTasks(resp.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}   style={styles.tableBody}>
      
      {/* Heading */}
      <Title style={styles.title}>My Tasks</Title>

      {/* Logout Button below heading, left corner */}
      <Button 
        mode="contained" 
        style={styles.logoutButton} 
        labelStyle={styles.logoutButtonText}
        onPress={() => confirmLogout(logout, navigation)}
      >
        Logout
      </Button>

      {/* Task Cards */}
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onUpdated={fetchTasks} />
      ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#009688', flexGrow: 1 },

  title: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#ffffff', 
    textAlign: 'center', 
    marginBottom: 10  // heading ke niche thoda gap for logout button
  },
    tableBody: {
    marginTop: 5,
    height: 500,
  },


  logoutButton: { 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    height: 55, 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',  // left side
    marginBottom: 20,         // task cards ke upar gap
  },

  logoutButtonText: { 
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});

export default EmployeeDashboard;
