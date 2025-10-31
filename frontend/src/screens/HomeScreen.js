import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topHalf}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.subtitle}>Employee Tasks Management System</Text>
      </View>

      <View style={styles.bottomHalf}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login', { role: 'Admin' })}
          style={styles.loginButton}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
        >
          Admin Login
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login', { role: 'Employee' })}
          style={styles.loginButton}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
        >
          Employee Login
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topHalf: { flex: 1, backgroundColor: '#009688', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  welcomeText: { fontSize: 42, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 24, fontWeight: '600', color: '#ffffff', textAlign: 'center' },
  bottomHalf: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  loginButton: { width: 240, borderRadius: 6, marginVertical: 12, backgroundColor: '#009688' },
  buttonContent: { height: 48, justifyContent: 'center' },
  buttonLabel: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
});

export default HomeScreen;