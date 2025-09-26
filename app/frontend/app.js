"use client";

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert, Image, Text, TextInput, View, TouchableOpacity, Modal, StyleSheet, FlatList, ActivityIndicator, StatusBar, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AppLogo from "./assets/images/app-logo.jpg";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

// Leaderboard screen as a functional component
function LeaderboardScreen() {
  const [players, setPlayers] = useState([
    { id: 1, name: "Agent A", points: 120 },
    { id: 2, name: "Agent B", points: 100 },
    { id: 3, name: "Agent C", points: 80 },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={players.sort((a,b) => b.points - a.points)}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 20, width: "100%" }}
        renderItem={({ item, index }) => (
          <View style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>{index + 1}. {item.name}</Text>
            <Text style={{ fontSize: 16, color: "#0A84FF" }}>{item.points} pts</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Stack Navigator
const Stack = createStackNavigator();

// Server URL
const SERVER_URL = "https://aquachain.onrender.com";
const ENDPOINT_PATH = "/api/reports";

// Custom Button
const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.9}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// ===================== Screen 1: Login =====================
function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.card, { alignItems: "center" }]}>
        <Image source={AppLogo} style={styles.bigLogo} />
        <Text style={styles.title}>AquaChain</Text>
        <Text style={styles.subtitle}>Field Data Collection</Text>
        <CustomButton title="Continue" onPress={() => navigation.navigate("Main")} />
      </View>
    </SafeAreaView>
  );
}

// ===================== Screen 2: Main =====================
function MainScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerWrap}>
        <Image source={AppLogo} style={styles.smallLogo} />
        <Text style={styles.title}>Hello, Field Agent 👋</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>
      </View>
      <View style={{ width: "100%" }}>
        <CustomButton title="+ Create New Report" onPress={() => navigation.navigate("Report")} />
        <CustomButton title="View Saved Reports" onPress={() => navigation.navigate("SavedReports")} />
        <CustomButton title="View Leaderboard" onPress={() => navigation.navigate("Leaderboard")} />
      </View>
    </SafeAreaView>
  );
}

// ===================== Screen 3: Report =====================
function ReportScreen({ navigation }) {
  const [projectName, setProjectName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [gps, setGps] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for geotagging.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const datetime = new Date().toISOString();
      let gps_latitude = null;
      let gps_longitude = null;
      let file_size = 0;

      try {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        gps_latitude = location.coords.latitude;
        gps_longitude = location.coords.longitude;
      } catch (error) {
        console.log('Location error:', error);
        Alert.alert('Location Error', 'Could not get GPS location.');
      }

      try {
        const stat = await FileSystem.getInfoAsync(uri);
        file_size = stat.size || 0;
      } catch (error) {
        console.log('File size error:', error);
      }

      setPhotos([...photos, { uri, datetime, gps_latitude, gps_longitude, file_size }]);
    }
  };

  const getLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const gpsString = `${location.coords.latitude.toFixed(4)}° N, ${location.coords.longitude.toFixed(4)}° E`;
      setGps(gpsString);
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert('Location Error', 'Could not get GPS location.');
    }
  };

  const handleSubmit = async () => {
    if (!projectName) {
      Alert.alert("Validation", "Please enter Project Name.");
      return;
    }
    if (photos.length < 3) {
      Alert.alert("Validation", "Please take at least 3 photos.");
      return;
    }

    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('gps', gps);
    formData.append('submittedAt', new Date().toISOString());

    photos.forEach((photo, index) => {
      formData.append('photos', {
        uri: photo.uri,
        name: `photo_${index + 1}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const res = await fetch(`${SERVER_URL}${ENDPOINT_PATH}`, {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const body = await res.json();
      Alert.alert("Success!", `Report uploaded. Server id: ${body.id || "unknown"}`);
      clearForm();
      navigation.replace("Main");
    } catch (err) {
      console.log("POST error:", err);
      Alert.alert("Upload failed", "Could not reach backend. Please try again.");
    }
  };

  const clearForm = () => {
    setProjectName("");
    setPhotos([]);
    setGps("");
  };

  useFocusEffect(
    useCallback(() => {
      return () => clearForm();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <Text style={styles.label}>Project Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <View style={{ marginVertical: 8, width: "100%" }}>
        <CustomButton title={`Add Photo (${photos.length}/3+)`} onPress={takePhoto} />
        {photos.length > 0 && (
          <FlatList
            data={photos}
            keyExtractor={(item, idx) => item.uri + String(idx)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, marginTop: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                setSelectedPhoto(item);
                setModalVisible(true);
              }}>
                <Image source={{ uri: item.uri }} style={styles.preview} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <View style={{ marginVertical: 8, width: "100%" }}>
        <CustomButton title="Get GPS Location" onPress={getLocation} />
        {gps && <Text style={styles.gps}>📍 {String(gps)}</Text>}
      </View>
      <View style={{ marginTop: 10, width: "100%" }}>
        <CustomButton title="Submit" onPress={handleSubmit} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {selectedPhoto && (
            <>
              <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} />
              <Text>Datetime: {String(selectedPhoto.datetime)}</Text>
              <Text>GPS Latitude: {String(selectedPhoto.gps_latitude?.toFixed(4) || 'N/A')}</Text>
              <Text>GPS Longitude: {String(selectedPhoto.gps_longitude?.toFixed(4) || 'N/A')}</Text>
              <Text>File Size: {String(selectedPhoto.file_size ? `${selectedPhoto.file_size} bytes` : 'N/A')}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ===================== Screen 4: Saved Reports =====================
function SavedReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${SERVER_URL}${ENDPOINT_PATH}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

      const data = await res.json();

      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports.slice().reverse());
      } else {
        setReports([]);
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setError("Failed to load reports. Check connection or server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text style={{ marginTop: 12 }}>Loading reports...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "#b00020", marginTop: 20 }}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchReports}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { alignItems: "stretch" }]}>
      <Text style={styles.title}>Saved Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item, index) => String(item.id || index)}
        contentContainerStyle={{ gap: 10, paddingBottom: 20, width: "100%" }}
        refreshing={loading}
        onRefresh={fetchReports}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No reports yet.</Text>}
        renderItem={({ item }) => {
          let displayDate = "N/A";
          if (item.submittedAt) {
            try {
              displayDate = new Date(item.submittedAt).toLocaleString();
            } catch {}
          }

          const firstPhoto = Array.isArray(item.photos) && item.photos.length > 0
            ? item.photos[0]
            : null;

          return (
            <View style={[styles.card, { flexDirection: "row", gap: 12, alignItems: "center" }]}>
              {firstPhoto ? (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPhoto({
                      uri: firstPhoto,
                      datetime: item.submittedAt || 'N/A',
                      gps_latitude: item.gps || null,
                      gps_longitude: null,
                      file_size: null,
                    });
                    setModalVisible(true);
                  }}
                >
                  <Image source={{ uri: firstPhoto }} style={styles.thumb} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.thumb, { backgroundColor: "#E6EDF5", alignItems: "center", justifyContent: "center" }]}>
                  <Text>📄</Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  {item.projectName || "Untitled"}
                </Text>
                <Text style={{ color: "#6b7280", marginTop: 2 }}>{String(displayDate)}</Text>
                {item.gps ? <Text style={{ marginTop: 2 }}>📍 {String(item.gps)}</Text> : null}
                <Text style={{ color: "#10B981", marginTop: 2, fontSize: 12 }}>
                  Status: {item.status || "Pending"}
                </Text>
                <Text style={{ color: "#6B7280", marginTop: 2, fontSize: 12 }}>
                  Photos: {Array.isArray(item.photos) ? item.photos.length : 0}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {selectedPhoto && (
            <>
              <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} />
              <Text>Datetime: {String(selectedPhoto.datetime)}</Text>
              <Text>GPS: {String(selectedPhoto.gps_latitude || 'N/A')}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ===================== App Root =====================
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="SavedReports" component={SavedReportsScreen} options={{ title: "Saved Reports" }} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ===================== Styles =====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC", justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS === "android" ? 20 : 0, padding: 20 },
  card: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 12, width: "100%", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 3, marginVertical: 10 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 6, color: "#0A84FF", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 16, textAlign: "center" },
  headerWrap: { width: "100%", alignItems: "center", marginBottom: 16 },
  label: { fontSize: 16, marginTop: 10, marginBottom: 4, color: "#333" },
  input: { borderWidth: 1, borderColor: "#D1D5DB", padding: 12, marginBottom: 12, borderRadius: 8, backgroundColor: "#F9FAFB", width: "100%" },
  button: { backgroundColor: "#0A84FF", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, marginVertical: 10, alignItems: "center", shadowColor: "#0A84FF", shadowOpacity: 0.25, shadowRadius: 8, elevation: 2 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16, letterSpacing: 0.2 },
  image: { width: "100%", height: 220, marginTop: 12, borderRadius: 10 },
  preview: { width: 100, height: 100, borderRadius: 10, backgroundColor: "#eef2f7" },
  thumb: { width: 54, height: 54, borderRadius: 8, backgroundColor: "#eef2f7" },
  bigLogo: { width: 120, height: 120, marginBottom: 12, borderRadius: 24 },
  smallLogo: { width: 40, height: 40, marginBottom: 8, borderRadius: 8 },
  gps: { marginTop: 8, fontSize: 15, fontStyle: "italic", color: "#444" },
  modalView: { flex: 1, backgroundColor: "white", marginTop: 60, margin: 20, borderRadius: 12, padding: 16, alignItems: "center" },
  modalImage: { width: "100%", height: 300, borderRadius: 10, marginBottom: 16 },
});

// App Registry
AppRegistry.registerComponent('main', () => App);
