import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/styles";

const { width, height } = Dimensions.get("window");

export default function PhotoDetailModal({ visible, onClose, photo }) {
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  // Reset loading state when photo changes
  React.useEffect(() => {
    if (photo) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [photo]);

  if (!photo) return null;

  // Extract photo URI properly
  const photoUri = typeof photo === 'string' ? photo : photo.uri;
  
  console.log("PhotoDetailModal - Photo URI:", photoUri);
  console.log("PhotoDetailModal - Full photo object:", photo);
  
  // Format date
  let formattedDate = "N/A";
  if (photo.datetime) {
    try {
      const date = new Date(photo.datetime);
      formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      formattedDate = String(photo.datetime);
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format GPS coordinates
  const formatGPSCoordinate = (value, isLongitude = false) => {
    if (!value) return "N/A";
    
    // If it's already a number
    if (typeof value === 'number') {
      const direction = value >= 0 
        ? (isLongitude ? 'E' : 'N')
        : (isLongitude ? 'W' : 'S');
      return `${Math.abs(value).toFixed(6)}° ${direction}`;
    }
    
    return String(value);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={localStyles.modalOverlay}>
        <View style={localStyles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={localStyles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={32} color={colors.white} />
          </TouchableOpacity>

          <ScrollView
            style={localStyles.scrollContent}
            contentContainerStyle={localStyles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Photo Display */}
            <View style={localStyles.photoContainer}>
              {imageLoading && (
                <View style={localStyles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={localStyles.loadingText}>Loading image...</Text>
                </View>
              )}
              
              {imageError && (
                <View style={localStyles.errorContainer}>
                  <Ionicons name="image-outline" size={64} color={colors.gray} />
                  <Text style={localStyles.errorText}>Failed to load image</Text>
                  <Text style={localStyles.errorSubtext}>{photoUri}</Text>
                </View>
              )}

              <Image
                source={{ uri: photoUri }}
                style={localStyles.photoImage}
                resizeMode="contain"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={(error) => {
                  console.log("Image loading error:", error.nativeEvent.error);
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            </View>

            {/* Photo Details Card */}
            <View style={localStyles.detailsCard}>
              <Text style={localStyles.cardTitle}>Photo Details</Text>

              {/* Date Time */}
              <View style={localStyles.detailRow}>
                <View style={localStyles.detailIconCircle}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </View>
                <View style={localStyles.detailContent}>
                  <Text style={localStyles.detailLabel}>Date & Time</Text>
                  <Text style={localStyles.detailValue}>{formattedDate}</Text>
                </View>
              </View>

              {/* GPS Latitude */}
              {photo.gps_latitude !== null && photo.gps_latitude !== undefined && (
                <View style={localStyles.detailRow}>
                  <View style={localStyles.detailIconCircle}>
                    <Ionicons name="navigate" size={20} color={colors.secondary} />
                  </View>
                  <View style={localStyles.detailContent}>
                    <Text style={localStyles.detailLabel}>GPS Latitude</Text>
                    <Text style={localStyles.detailValue}>
                      {formatGPSCoordinate(photo.gps_latitude, false)}
                    </Text>
                  </View>
                </View>
              )}

              {/* GPS Longitude */}
              {photo.gps_longitude !== null && photo.gps_longitude !== undefined && (
                <View style={localStyles.detailRow}>
                  <View style={localStyles.detailIconCircle}>
                    <Ionicons name="location" size={20} color={colors.secondary} />
                  </View>
                  <View style={localStyles.detailContent}>
                    <Text style={localStyles.detailLabel}>GPS Longitude</Text>
                    <Text style={localStyles.detailValue}>
                      {formatGPSCoordinate(photo.gps_longitude, true)}
                    </Text>
                  </View>
                </View>
              )}

              {/* GPS Altitude */}
              {photo.gps_altitude !== null && photo.gps_altitude !== undefined && (
                <View style={localStyles.detailRow}>
                  <View style={localStyles.detailIconCircle}>
                    <Ionicons name="trending-up" size={20} color={colors.secondary} />
                  </View>
                  <View style={localStyles.detailContent}>
                    <Text style={localStyles.detailLabel}>Altitude</Text>
                    <Text style={localStyles.detailValue}>
                      {typeof photo.gps_altitude === 'number' 
                        ? `${photo.gps_altitude.toFixed(2)} m`
                        : photo.gps_altitude || "N/A"}
                    </Text>
                  </View>
                </View>
              )}

              {/* File Size */}
              <View style={localStyles.detailRow}>
                <View style={localStyles.detailIconCircle}>
                  <Ionicons name="document" size={20} color={colors.warning} />
                </View>
                <View style={localStyles.detailContent}>
                  <Text style={localStyles.detailLabel}>File Size</Text>
                  <Text style={localStyles.detailValue}>
                    {formatFileSize(photo.file_size)}
                  </Text>
                </View>
              </View>

              {/* Photo URI (for debugging) */}
              <View style={localStyles.detailRow}>
                <View style={localStyles.detailIconCircle}>
                  <Ionicons name="link" size={20} color={colors.gray} />
                </View>
                <View style={localStyles.detailContent}>
                  <Text style={localStyles.detailLabel}>File Location</Text>
                  <Text style={localStyles.detailValueSmall} numberOfLines={2}>
                    {photoUri}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width - 40,
    maxHeight: height - 100,
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 15,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  photoContainer: {
    width: "100%",
    height: 400,
    backgroundColor: colors.extraLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.extraLight,
    zIndex: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.gray,
    fontWeight: "500",
  },
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.extraLight,
    padding: 20,
    zIndex: 5,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.danger,
    fontWeight: "600",
    textAlign: "center",
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 11,
    color: colors.gray,
    textAlign: "center",
  },
  detailsCard: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.extraLight,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  detailIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  detailValueSmall: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.gray,
    lineHeight: 16,
  },
});