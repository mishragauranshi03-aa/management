import { Alert, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const confirmLogout = (logout, navigation) => {
  const doLogout = async () => {
    logout();
    await AsyncStorage.removeItem('NAVIGATION_STATE'); //  Clear saved state
    navigation.replace("Home");
  };

  if (Platform.OS === "web") {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) doLogout();
  } else {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: doLogout }
      ]
    );
  }
};