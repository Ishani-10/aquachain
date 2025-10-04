import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../styles/styles";
import { SERVER_URL, ENDPOINT_PATH } from "../config/constants";

const { width } = Dimensions.get("window");

export default function MainScreen({ route, navigation }) {
  const { name, agentId, project, projectName, projectId } = route.params || {};
  const [fadeAnim] = useState(new Animated.Value(0));
  const [stats, setStats] = useState({
    totalReports: 0,
    thisMonth: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${SERVER_URL}${ENDPOINT_PATH}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reports)) {
          const total = data.reports.length;
          const thisMonth = data.reports.filter(r => {
            const date = new Date(r.submittedAt);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).length;
          const completed = data.reports.filter(r => r.status === "Completed").length;
          const pending = total - completed;

          setStats({ totalReports: total, thisMonth, completed, pending });
        }
      }
    } catch (error) {
      console.log("Stats fetch error:", error);
    }
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const handleBackToProjects = () => {
    navigation.navigate("ProjectSelection", { name, agentId });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={localStyles.headerTop}>
          <View style={localStyles.headerLeft}>
            <View style={localStyles.avatarCircle}>
              <Text style={localStyles.avatarText}>
                {name ? name.charAt(0).toUpperCase() : "A"}
              </Text>
            </View>
            <View>
              <Text style={localStyles.headerGreeting}>Welcome back,</Text>
              <Text style={styles.headerTitle}>{name || "Agent"} 👋</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={localStyles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={localStyles.projectBanner}>
          <Ionicons name="briefcase" size={20} color={colors.white} style={{ opacity: 0.9 }} />
          <Text style={localStyles.projectText}>
            {project || projectName || "All Projects"}
          </Text>
          <TouchableOpacity onPress={handleBackToProjects} style={localStyles.changeProject}>
            <Ionicons name="swap-horizontal" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={localStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <Animated.View style={[localStyles.statsGrid, { opacity: fadeAnim }]}>
          <StatCard
            icon="document-text"
            label="Total Reports"
            value={stats.totalReports}
            color={colors.primaryLight}
            bgColor="#eff6ff"
          />
          <StatCard
            icon="calendar"
            label="This Month"
            value={stats.thisMonth}
            color={colors.secondary}
            bgColor="#ecfdf5"
          />
          <StatCard
            icon="checkmark-circle"
            label="Completed"
            value={stats.completed}
            color="#8b5cf6"
            bgColor="#faf5ff"
          />
          <StatCard
            icon="time"
            label="Pending"
            value={stats.pending}
            color={colors.warning}
            bgColor="#fffbeb"
          />
        </Animated.View>

        {/* Quick Actions */}
        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={localStyles.actionCard}
            onPress={() =>
              navigation.navigate("Report", {
                name,
                agentId,
                projectName: project || projectName,
                projectId,
              })
            }
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={localStyles.actionGradient}
            >
              <View style={localStyles.actionLeft}>
                <View style={localStyles.actionIconCircle}>
                  <Ionicons name="add-circle" size={28} color={colors.white} />
                </View>
                <View>
                  <Text style={localStyles.actionTitle}>Create New Report</Text>
                  <Text style={localStyles.actionSubtitle}>
                    Document field activities
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.actionCard}
            onPress={() =>
              navigation.navigate("SavedReports", {
                name,
                agentId,
                projectName: project || projectName,
                projectId,
              })
            }
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.secondary, colors.secondaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={localStyles.actionGradient}
            >
              <View style={localStyles.actionLeft}>
                <View style={localStyles.actionIconCircle}>
                  <Ionicons name="folder-open" size={28} color={colors.white} />
                </View>
                <View>
                  <Text style={localStyles.actionTitle}>View All Reports</Text>
                  <Text style={localStyles.actionSubtitle}>
                    Browse submitted reports
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Features Grid */}
        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Features</Text>
          <View style={localStyles.featuresGrid}>
            <FeatureCard
              icon="camera"
              label="Photo Capture"
              description="High-quality field photography"
              color={colors.primaryLight}
            />
            <FeatureCard
              icon="location"
              label="GPS Tracking"
              description="Accurate geolocation data"
              color={colors.secondary}
            />
            <FeatureCard
              icon="analytics"
              label="Work Types"
              description="Categorized activities"
              color="#8b5cf6"
            />
            <FeatureCard
              icon="shield-checkmark"
              label="Verification"
              description="Secure data validation"
              color={colors.warning}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <View style={[localStyles.statIconCircle, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={localStyles.statValue}>{value}</Text>
      <Text style={localStyles.statLabel}>{label}</Text>
    </View>
  );
}

// Feature Card Component
function FeatureCard({ icon, label, description, color }) {
  return (
    <View style={localStyles.featureCard}>
      <View style={[localStyles.featureIcon, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={localStyles.featureLabel}>{label}</Text>
      <Text style={localStyles.featureDesc}>{description}</Text>
    </View>
  );
}

const localStyles = {
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
  },
  headerGreeting: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
    fontWeight: "500",
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  projectBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  projectText: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  changeProject: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 12,
    marginTop: -20,
  },
  statIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: colors.dark,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 22,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  actionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  actionSubtitle: {
    color: colors.white,
    fontSize: 13,
    opacity: 0.9,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: colors.dark,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 4,
    textAlign: "center",
  },
  featureDesc: {
    fontSize: 12,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 18,
  },
};