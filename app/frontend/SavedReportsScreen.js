import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../styles/styles";
import PhotoDetailModal from "../components/PhotoDetailModal";
import { SERVER_URL, ENDPOINT_PATH } from "../config/constants";
import { workTypeConfig } from "../config/workTypes";

export default function SavedReportsScreen({ route, navigation }) {
  const { projectName, projectId, loginMethod } = route.params || {};
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
    fetchReports();
  }, [projectName]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      let url = `${SERVER_URL}${ENDPOINT_PATH}`;

      if (projectName) {
        url += `?project=${encodeURIComponent(projectName)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

      const data = await res.json();

      if (data.success && Array.isArray(data.reports)) {
        let filteredReports = data.reports.slice().reverse();

        if (projectName) {
          filteredReports = filteredReports.filter(
            (report) => report.projectName === projectName
          );
        }

        setReports(filteredReports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setError("Failed to load reports. Check connection or server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const getWorkTypeDisplay = (workType) => {
    const config = workTypeConfig[workType];
    if (config) {
      return config;
    }
    return {
      label: `❓ ${workType || "Unknown"}`,
      color: colors.gray,
      bgColor: colors.extraLight,
    };
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={localStyles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={localStyles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.danger} />
          <Text style={localStyles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchReports} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <View style={localStyles.retryContent}>
                <Ionicons name="refresh" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Retry</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={localStyles.headerTextContainer}>
            <Text style={localStyles.headerTitle}>
              {projectName ? `${projectName}` : "All Reports"}
            </Text>
            <Text style={localStyles.headerSubtitle}>
              {reports.length} {reports.length === 1 ? "report" : "reports"}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <Animated.View style={[styles.flex1, { opacity: fadeAnim }]}>
        <FlatList
          data={reports}
          keyExtractor={(item, index) => String(item.id || index)}
          contentContainerStyle={localStyles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={localStyles.emptyContainer}>
              <Ionicons name="document-text-outline" size={80} color={colors.lightGray} />
              <Text style={localStyles.emptyText}>
                {projectName
                  ? `No reports found for ${projectName}`
                  : "No reports yet"}
              </Text>
              <Text style={localStyles.emptySubtext}>
                Create your first report to get started!
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            let displayDate = "N/A";
            if (item.submittedAt) {
              try {
                const date = new Date(item.submittedAt);
                displayDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } catch {}
            }

            const firstPhoto =
              Array.isArray(item.photos) && item.photos.length > 0
                ? item.photos[0]
                : null;

            const workTypeDisplay = getWorkTypeDisplay(item.workType);

            return (
              <View style={[styles.card, localStyles.reportCard]}>
                {/* Photo Section */}
                <View style={localStyles.photoSection}>
                  {firstPhoto ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedPhoto({
                          uri: firstPhoto,
                          datetime: item.submittedAt || "N/A",
                          gps_latitude: item.gps || null,
                          gps_longitude: null,
                          file_size: null,
                        });
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: firstPhoto }}
                        style={localStyles.reportThumbnail}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={localStyles.reportThumbnailPlaceholder}>
                      <Ionicons name="image-outline" size={32} color={colors.lightGray} />
                    </View>
                  )}
                  {Array.isArray(item.photos) && item.photos.length > 1 && (
                    <View style={localStyles.photoCount}>
                      <Ionicons name="images" size={12} color={colors.white} />
                      <Text style={localStyles.photoCountText}>
                        +{item.photos.length - 1}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Content Section */}
                <View style={localStyles.contentSection}>
                  <Text style={localStyles.reportTitle} numberOfLines={1}>
                    {item.projectName || "Untitled Report"}
                  </Text>

                  {/* Work Type Badge */}
                  <View
                    style={[
                      localStyles.workTypeBadge,
                      {
                        backgroundColor: workTypeDisplay.bgColor,
                        borderColor: workTypeDisplay.color,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        localStyles.workTypeBadgeText,
                        { color: workTypeDisplay.color },
                      ]}
                    >
                      {workTypeDisplay.label}
                    </Text>
                  </View>

                  {/* Date */}
                  <View style={localStyles.infoRow}>
                    <Ionicons name="calendar-outline" size={14} color={colors.gray} />
                    <Text style={localStyles.infoText}>{String(displayDate)}</Text>
                  </View>

                  {/* GPS */}
                  {item.gps && (
                    <View style={localStyles.infoRow}>
                      <Ionicons name="location-outline" size={14} color={colors.secondary} />
                      <Text style={[localStyles.infoText, { color: colors.secondary }]}>
                        {String(item.gps)}
                      </Text>
                    </View>
                  )}

                  {/* Status & Photos */}
                  <View style={localStyles.bottomRow}>
                    <View
                      style={[
                        localStyles.statusBadge,
                        { backgroundColor: colors.secondaryAlpha },
                      ]}
                    >
                      <Ionicons name="checkmark-circle" size={12} color={colors.secondary} />
                      <Text style={[localStyles.statusText, { color: colors.secondary }]}>
                        {item.status || "Pending"}
                      </Text>
                    </View>
                    <View style={localStyles.photoInfo}>
                      <Ionicons name="camera" size={12} color={colors.gray} />
                      <Text style={localStyles.photoInfoText}>
                        {Array.isArray(item.photos) ? item.photos.length : 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </Animated.View>

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
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  listContent: {
    padding: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray,
    fontWeight: "500",
  },
  errorContainer: {
    alignItems: "center",
    gap: 20,
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    fontWeight: "500",
  },
  retryContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
    textAlign: "center",
  },
  reportCard: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  photoSection: {
    position: "relative",
  },
  reportThumbnail: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: colors.extraLight,
  },
  reportThumbnailPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: colors.extraLight,
    alignItems: "center",
    justifyContent: "center",
  },
  photoCount: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: colors.dark,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  contentSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 8,
  },
  workTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  workTypeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.gray,
    flex: 1,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  photoInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  photoInfoText: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: "500",
  },
};