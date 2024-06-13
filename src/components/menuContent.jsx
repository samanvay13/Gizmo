import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MenuContent = ({ onCloseMenu }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onCloseMenu}>
        <Ionicons name="close-outline" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <Image source={require('../assets/avatars/mr.diablo.png')} style={styles.avatarImage} />
        <View style={styles.row}>
          <View style={styles.onlineDot} />
          <Text style={styles.username}>mr.diablo</Text>
          <Ionicons name="chevron-down-outline" size={18} color="black" style={styles.profileDropdown} />
        </View>
      </View>
      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 10,
    zIndex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 100,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row'
  },
  onlineDot: {
    marginVertical: 10,
    marginHorizontal: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "lime",
  },
  username: {
    fontSize: 25,
    fontWeight: "bold"
  },
  profileDropdown: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  menuItemText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  settingsButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButtonText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default MenuContent;
