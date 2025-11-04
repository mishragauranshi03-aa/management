import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Title } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ route, navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const roleFromHome = route.params?.role;

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
    const role = await login(email.trim(), password, roleFromHome);
      if (role === "Admin") navigation.replace('AdminDashboard');
      else if (role === "Employee") navigation.replace('EmployeeDashboard');
      else setError('Invalid login credentials');
    } catch (e) {
      
    console.log("Login error:", e.response?.data || e.message);

    if (e.response?.data?.detail === "Access denied for this role") {
      setError("Access denied for this role");
    } else if (e.response?.data?.detail === "Invalid credentials") {
      setError("Login failed. Please check your credentials.");
    } else {
      setError("Login failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.background}
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Login as {roleFromHome}</Title>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              mode="contained"
              style={styles.button}
              onPress={handleLogin}
              loading={loading}
              labelStyle={{ fontWeight: 'bold',  fontSize: 18}}
            >
              Login
            </Button>

            <Button
              mode="outlined"
              style={styles.backButton}
              onPress={() => navigation.replace('Home')}
              textColor="white"
              labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
            >
              Back to Home
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: { width: '30%',},
  card: {
    padding: 90,
    borderRadius: 15,
    elevation: 8,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 50,
    textAlign: 'center'
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10
  },
  button: {
    marginTop: 10,
    borderRadius: 30,
    backgroundColor: '#6200ee',
     borderWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 45,
    alignSelf: 'center',
    minWidth: 120,
    
  },
  backButton: {
    marginTop: 15,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignSelf: 'center',
    minWidth: 120,

  },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});

export default LoginScreen;