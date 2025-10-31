import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { confirmLogout } from '../utils/logoutHelper';

const AdminDashboard = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const backAction = () => true; 
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Admin Dashboard</Title>

      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("ManageEmployees")}>Manage Employees</Button>
      <Button mode="contained" style={styles.buttonSecondary} onPress={() => navigation.navigate("ManageTasks")}>Manage Tasks</Button>
      <Button mode="outlined" style={styles.logoutButton} onPress={() => confirmLogout(logout, navigation)}>Logout</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f7', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6200ee', marginBottom: 30, textAlign: 'center' },
  button: { width: 220, borderRadius: 30, backgroundColor: '#6200ee', paddingVertical: 8, marginTop: 10 },
  buttonSecondary: { width: 220, borderRadius: 30, backgroundColor: '#03dac6', paddingVertical: 8, marginTop: 10 },
  logoutButton: { width: 220, borderRadius: 30, paddingVertical: 6, marginTop: 30, borderColor: '#6200ee', borderWidth: 2 }
});

export default AdminDashboard;