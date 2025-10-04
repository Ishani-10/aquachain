import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../styles/styles";
import WorkTypeModal from "../components/WorkTypeModal";
import PhotoDetailModal from "../components/PhotoDetailModal";
import { SERVER_URL, ENDPOINT_PATH } from "../config/constants";
import { workTypeOptions } from "../config/workTypes";

export default function ReportScreen({ route, navigation }) {
  const { name, agentId, projectName, projectId, loginMethod } = route.params || {};
  const [localProjectName, setLocalProjectName] = useState(projectName || "");
  const [workType, setWorkType] = useState("");
  const [workTypeModalVisible, setWorkTypeModalVisible] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [gps, setGps] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required for geotagging."
        );
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
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        gps_latitude = location.coords.latitude;
        gps_longitude = location.coords.longitude;
      } catch (error) {
        console.log("Location error:", error);
      }

      // Get file size from the asset info
      try {
        // The asset object from ImagePicker already contains file size info
        if (result.assets[0].fileSize) {
          file_size = result.assets[0].fileSize;
        } else if (result.assets[0].width && result.assets[0].height) {
          // Estimate file size based on dimensions (rough estimate)
          // Average JPEG compression: ~100-200 KB per megapixel
          const megapixels = (result.assets[0].width * result.assets[0].height) / 1000000;
          file_size = Math.round(megapixels * 150000); // 150KB per megapixel estimate
        } else {
          // Default estimate if no info available
          file_size = 500000; // 500KB default
        }
      } catch (error) {
        console.log("File size estimation error:", error);
        file_size = 0;
      }

      setPhotos([
        ...photos,
        { uri, datetime, gps_latitude, gps_longitude, file_size },
      ]);
    }
  };

  const getLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const gpsString = `${location.coords.latitude.toFixed(4)}° N, ${location.coords.longitude.toFixed(4)}° E`;
      setGps(gpsString);
      Alert.alert("Success", "Location captured successfully!");
    } catch (error) {
      console.log("Location error:", error);
      Alert.alert("Error", "Could not get GPS location.");
    }
  };

  const handleWorkTypeSelect = (selectedWorkType) => {
    setWorkType(selectedWorkType);
    setWorkTypeModalVisible(false);
  };

  const getSelectedWorkTypeLabel = () => {
    const selected = workTypeOptions.find((option) => option.value === workType);
    return selected ? selected.label : "Select Work Type";
  };

  const getSelectedWorkTypeColor = () => {
    const selected = workTypeOptions.find((option) => option.value === workType);
    return selected ? selected.color : colors.gray;
  };

  const handleSubmit = async () => {
    const currentProjectName = localProjectName || projectName;
    if (!currentProjectName) {
      Alert.alert("Validation", "Please enter Project Name.");
      return;
    }
    if (!workType) {
      Alert.alert("Validation", "Please select a Work Type.");
      return;
    }
    if (photos.length < 3) {
      Alert.alert("Validation", "Please take at least 3 photos.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("projectName", currentProjectName);
    formData.append("workType", workType);
    formData.append("gps", gps);
    formData.append("submittedAt", new Date().toISOString());
    formData.append("agentId", agentId || "");
    formData.append("agentName", name || "");
    formData.append("loginMethod", loginMethod || "email");

    photos.forEach((photo, index) => {
      formData.append("photos", {
        uri: photo.uri,
        name: `photo_${index + 1}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      const res = await fetch(`${SERVER_URL}${ENDPOINT_PATH}`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const body = await res.json();
      Alert.alert(
        "Success! 🎉",
        `Report uploaded successfully!\nServer ID: ${body.id || "unknown"}`
      );
      clearForm();
      navigation.goBack();
    } catch (err) {
      console.log("POST error:", err);
      Alert.alert("Upload Failed", "Could not reach backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setLocalProjectName(projectName || "");
    setWorkType("");
    setPhotos([]);
    setGps("");
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  useFocusEffect(
    useCallback(() => {
      return () => clearForm();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={localStyles.header}
      >
        <View style={localStyles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={localStyles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={localStyles.headerTitle}>Create Report</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={localStyles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Project Name Card */}
          <View style={styles.card}>
            <View style={localStyles.inputHeader}>
              <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
              <Text style={localStyles.inputTitle}>Project Name</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter project name"
              placeholderTextColor={colors.lightGray}
              value={localProjectName}
              onChangeText={setLocalProjectName}
              editable={!projectName}
            />
          </View>

          {/* Work Type Card */}
          <View style={styles.card}>
            <View style={localStyles.inputHeader}>
              <Ionicons name="construct-outline" size={20} color={colors.primary} />
              <Text style={localStyles.inputTitle}>Work Type</Text>
            </View>
            <TouchableOpacity
              style={[
                localStyles.workTypeButton,
                workType && { borderColor: getSelectedWorkTypeColor(), borderWidth: 2 },
              ]}
              onPress={() => setWorkTypeModalVisible(true)}
            >
              <Text
                style={[
                  localStyles.workTypeText,
                  workType && { color: getSelectedWorkTypeColor() },
                ]}
              >
                {getSelectedWorkTypeLabel()}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={workType ? getSelectedWorkTypeColor() : colors.gray}
              />
            </TouchableOpacity>

            {workType && (
              <View
                style={[
                  localStyles.selectedBadge,
                  { backgroundColor: getSelectedWorkTypeColor() + "15" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={getSelectedWorkTypeColor()}
                />
                <Text
                  style={[
                    localStyles.selectedBadgeText,
                    { color: getSelectedWorkTypeColor() },
                  ]}
                >
                  {getSelectedWorkTypeLabel()}
                </Text>
              </View>
            )}
          </View>

          {/* Photos Card */}
          <View style={styles.card}>
            <View style={localStyles.inputHeader}>
              <Ionicons name="camera-outline" size={20} color={colors.primary} />
              <Text style={localStyles.inputTitle}>
                Photos ({photos.length}/3+)
              </Text>
            </View>

            <TouchableOpacity
              style={localStyles.photoButton}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primaryLight, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={localStyles.photoButtonGradient}
              >
                <Ionicons name="camera" size={24} color={colors.white} />
                <Text style={localStyles.photoButtonText}>Take Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            {photos.length > 0 && (
              <FlatList
                data={photos}
                keyExtractor={(item, idx) => item.uri + String(idx)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={localStyles.photoList}
                renderItem={({ item, index }) => (
                  <View style={localStyles.photoItem}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedPhoto(item);
                        setModalVisible(true);
                      }}
                    >
                      <Image source={{ uri: item.uri }} style={localStyles.photoThumbnail} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={localStyles.removePhoto}
                      onPress={() => removePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>

          {/* GPS Card */}
          <View style={styles.card}>
            <View style={localStyles.inputHeader}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <Text style={localStyles.inputTitle}>GPS Location</Text>
            </View>

            <TouchableOpacity
              style={localStyles.gpsButton}
              onPress={getLocation}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={localStyles.gpsButtonGradient}
              >
                <Ionicons name="navigate" size={24} color={colors.white} />
                <Text style={localStyles.gpsButtonText}>Get GPS Location</Text>
              </LinearGradient>
            </TouchableOpacity>

            {gps && (
              <View style={localStyles.gpsDisplay}>
                <Ionicons name="location" size={18} color={colors.secondary} />
                <Text style={localStyles.gpsText}>{String(gps)}</Text>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
            style={{ marginBottom: 30 }}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.buttonGradient, localStyles.submitButton]}
            >
              {loading ? (
                <Text style={styles.buttonText}>Uploading...</Text>
              ) : (
                <View style={localStyles.submitContent}>
                  <Ionicons name="cloud-upload" size={24} color={colors.white} />
                  <Text style={styles.buttonText}>Submit Report</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Work Type Modal */}
      <WorkTypeModal
        visible={workTypeModalVisible}
        onClose={() => setWorkTypeModalVisible(false)}
        workType={workType}
        onSelect={handleWorkTypeSelect}
        workTypeOptions={workTypeOptions}
      />

      {/* Photo Detail Modal */}
      <PhotoDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        photo={selectedPhoto}
      />
    </SafeAreaView>
  );
}

const localStyles = {
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
  },
  workTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.extraLight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  workTypeText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.gray,
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  photoButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
  },
  photoButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  photoButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  photoList: {
    gap: 12,
    paddingVertical: 8,
  },
  photoItem: {
    position: "relative",
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 14,
    backgroundColor: colors.extraLight,
  },
  removePhoto: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  gpsButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  gpsButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  gpsButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  gpsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.secondaryAlpha,
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  gpsText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.secondary,
    flex: 1,
  },
  submitButton: {
    marginTop: 10,
  },
  submitContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
};