import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, BackHandler, TouchableOpacity, Text } from 'react-native';
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

      {/* Logout button moved to top-left corner */}
      <TouchableOpacity 
        style={styles.logoutButtonTop} 
        onPress={() => confirmLogout(logout, navigation)}
      >
        <Text style={styles.logoutText}>Logout ←</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Title style={styles.title}>Admin Dashboard</Title>

        <Button 
          mode="contained" 
          style={styles.button} 
          labelStyle={{ fontSize: 20, fontWeight: 'bold' }}
          onPress={() => navigation.navigate("ManageEmployees")}
        >
          Manage Employees
        </Button>

        <Button 
          mode="contained" 
          style={styles.buttonSecondary} 
          labelStyle={{ fontSize: 20, fontWeight: 'bold' }}
          onPress={() => navigation.navigate("ManageTasks")}
        >
          Manage Tasks
        </Button>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f4f7', 
  },
  card: {
    width: 600,
    height: 400,
    padding: 60,
    borderRadius: 12,
    backgroundColor:'#ffffff',
    alignItems: 'center',
    elevation: 8,
    borderWidth: 4,          // ⭐ Added
    borderColor: '#009688', 
  },
  title: { 
    fontSize: 38, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color:  '#8B4513',
  },
  button: { 
    width: '80%', 
    borderRadius: 8, 
    backgroundColor:'#009688', 
    paddingVertical: 10, 
    marginTop: 40 
  },
  buttonSecondary: { 
    width: '80%', 
    borderRadius: 8, 
    backgroundColor: '#009688', 
    paddingVertical: 10, 
    marginTop: 40
  },
  logoutButtonTop: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 150, // same as card button width
    borderRadius: 30,
    paddingVertical: 20,
    borderColor: '#6200ee',
    borderWidth: 2,
    backgroundColor:'#009688', 
    zIndex: 10,
    alignItems: 'center',
  },
  logoutText: {
    color:'#ffffff' , // black text with arrow
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default AdminDashboard;
