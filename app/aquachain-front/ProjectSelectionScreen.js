import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './styles/styles';

const { width } = Dimensions.get('window');

const ProjectSelectionScreen = ({ route, navigation }) => {
  const { name, agentId } = route.params || {};
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Sample projects - you can modify this or fetch from your server
  const projects = [
    {
      id: 1,
      name: "Mangrove Restoration Phase1",
      description: "Water Quality Assessment - Phase 1",
      status: "Active",
      reports: 24,
      lastUpdate: "2 hours ago",
      icon: "water",
      gradientColors: [colors.primary, colors.primaryLight]
    },
    {
      id: 2,
      name: "Coral Reef Protection Initiative",
      description: "Environmental Monitoring - Urban Areas",
      status: "Active",
      reports: 18,
      lastUpdate: "1 day ago",
      icon: "leaf",
      gradientColors: [colors.secondary, colors.secondaryLight]
    },
    {
      id: 3,
      name: "Seagrass Meadow Restoration",
      description: "Coastal Water Analysis - Research",
      status: "Completed",
      reports: 45,
      lastUpdate: "3 days ago",
      icon: "checkmark-circle",
      gradientColors: ['#7c3aed', '#a78bfa']
    },
    {
      id: 4,
      name: "Mangrove Restoration Phase2",
      description: "Industrial Discharge Monitoring",
      status: "Pending",
      reports: 12,
      lastUpdate: "5 hours ago",
      icon: "time",
      gradientColors: [colors.warning, '#fbbf24']
    }
  ];

  const handleProjectSelect = (project) => {
    navigation.replace("Main", { 
      name, 
      agentId, 
      project: project.name,
      projectName: project.name,
      projectId: project.id 
    });
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return colors.secondary;
      case 'Completed': return '#8b5cf6';
      case 'Pending': return colors.warning;
      default: return colors.gray;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Active': return colors.secondaryAlpha;
      case 'Completed': return '#faf5ff';
      case 'Pending': return '#fffbeb';
      default: return colors.extraLight;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
              <Text style={localStyles.agentIdText}>Agent ID: {agentId || "N/A"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={localStyles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={localStyles.headerInfo}>
          <Ionicons name="briefcase" size={20} color={colors.white} style={{ opacity: 0.9 }} />
          <Text style={localStyles.headerInfoText}>Select Your Project</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={localStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <Animated.View style={[localStyles.statsGrid, { opacity: fadeAnim }]}>
          <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
            <View style={[localStyles.statIconCircle, { backgroundColor: colors.primaryAlpha }]}>
              <Ionicons name="briefcase" size={24} color={colors.primary} />
            </View>
            <Text style={localStyles.statValue}>{projects.length}</Text>
            <Text style={localStyles.statLabel}>Total Projects</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#ecfdf5' }]}>
            <View style={[localStyles.statIconCircle, { backgroundColor: colors.secondaryAlpha }]}>
              <Ionicons name="pulse" size={24} color={colors.secondary} />
            </View>
            <Text style={localStyles.statValue}>
              {projects.filter(p => p.status === 'Active').length}
            </Text>
            <Text style={localStyles.statLabel}>Active Projects</Text>
          </View>
        </Animated.View>

        {/* Section Title */}
        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Available Projects</Text>

          {/* Project Cards */}
          {projects.map((project, index) => (
            <Animated.View 
              key={project.id}
              style={{ 
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}
            >
              <TouchableOpacity
                style={localStyles.projectCard}
                onPress={() => handleProjectSelect(project)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={project.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={localStyles.projectGradient}
                >
                  {/* Project Header */}
                  <View style={localStyles.projectHeader}>
                    <View style={localStyles.projectIconCircle}>
                      <Ionicons name={project.icon} size={28} color={colors.white} />
                    </View>
                    <View style={localStyles.projectInfo}>
                      <Text style={localStyles.projectName} numberOfLines={1}>
                        {project.name}
                      </Text>
                      <Text style={localStyles.projectDescription} numberOfLines={2}>
                        {project.description}
                      </Text>
                    </View>
                  </View>

                  {/* Project Meta */}
                  <View style={localStyles.projectMeta}>
                    <View style={localStyles.metaItem}>
                      <Ionicons name="document-text" size={16} color={colors.white} />
                      <Text style={localStyles.metaText}>{project.reports} reports</Text>
                    </View>
                    <View style={localStyles.metaItem}>
                      <Ionicons name="time" size={16} color={colors.white} />
                      <Text style={localStyles.metaText}>{project.lastUpdate}</Text>
                    </View>
                  </View>

                  {/* Project Footer */}
                  <View style={localStyles.projectFooter}>
                    <View style={localStyles.statusBadge}>
                      <View 
                        style={[
                          localStyles.statusDot, 
                          { backgroundColor: getStatusColor(project.status) }
                        ]} 
                      />
                      <Text style={localStyles.statusText}>{project.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.white} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  agentIdText: {
    color: colors.white,
    fontSize: 13,
    opacity: 0.85,
    marginTop: 2,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  headerInfoText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: "row",
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
  projectCard: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: colors.dark,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  projectGradient: {
    padding: 22,
  },
  projectHeader: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  projectIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  projectDescription: {
    color: colors.white,
    fontSize: 13,
    opacity: 0.9,
    lineHeight: 18,
  },
  projectMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: colors.white,
    fontSize: 13,
    opacity: 0.9,
  },
  projectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
};

export default ProjectSelectionScreen;