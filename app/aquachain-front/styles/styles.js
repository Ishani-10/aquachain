import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Color Palette
const colors = {
  primary: "#1e40af",
  primaryLight: "#3b82f6",
  primaryDark: "#1e3a8a",
  secondary: "#10b981",
  secondaryLight: "#34d399",
  accent: "#06b6d4",
  accentLight: "#22d3ee",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  dark: "#0f172a",
  darkGray: "#1e293b",
  gray: "#64748b",
  lightGray: "#94a3b8",
  extraLight: "#f1f5f9",
  background: "#f8fafc",
  white: "#ffffff",
  
  // Transparent colors
  primaryAlpha: "rgba(30, 64, 175, 0.1)",
  secondaryAlpha: "rgba(16, 185, 129, 0.1)",
  accentAlpha: "rgba(6, 182, 212, 0.1)",
};

export const styles = StyleSheet.create({
  // ==================== CONTAINERS ====================
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  gradientContainer: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    padding: 20,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  // ==================== CARDS ====================
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginVertical: 10,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  cardGradient: {
    borderRadius: 20,
    padding: 24,
    marginVertical: 10,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 28,
    marginVertical: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },

  statCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: (width - 52) / 2,
    alignItems: "center",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  featureCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 24,
    marginVertical: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  reportCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  // ==================== HEADERS ====================
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
    fontWeight: "500",
  },

  // ==================== AVATARS ====================
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryAlpha,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  avatarMedium: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },

  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryAlpha,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },

  // ==================== BUTTONS ====================
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 8,
  },

  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 8,
  },

  buttonSecondary: {
    backgroundColor: colors.white,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    marginVertical: 8,
  },

  buttonOutline: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    marginVertical: 8,
  },

  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  buttonTextSecondary: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  buttonIcon: {
    marginRight: 8,
  },

  // ==================== INPUTS ====================
  inputContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 8,
    marginLeft: 4,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.extraLight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.dark,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  inputError: {
    borderColor: colors.danger,
  },

  inputIcon: {
    position: "absolute",
    right: 16,
    top: 18,
  },

  // ==================== BADGES & TAGS ====================
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badgePrimary: {
    backgroundColor: colors.primaryAlpha,
  },

  badgeSuccess: {
    backgroundColor: colors.secondaryAlpha,
  },

  badgeWarning: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryAlpha,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 4,
  },

  // ==================== TYPOGRAPHY ====================
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.dark,
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray,
    marginBottom: 20,
  },

  heading1: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 12,
  },

  heading2: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 10,
  },

  heading3: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 8,
  },

  bodyLarge: {
    fontSize: 17,
    color: colors.dark,
    lineHeight: 26,
  },

  body: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 24,
  },

  bodySmall: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 20,
  },

  caption: {
    fontSize: 12,
    color: colors.lightGray,
    lineHeight: 18,
  },

  textBold: {
    fontWeight: "700",
  },

  textSemiBold: {
    fontWeight: "600",
  },

  textCenter: {
    textAlign: "center",
  },

  textPrimary: {
    color: colors.primary,
  },

  textSecondary: {
    color: colors.secondary,
  },

  textWhite: {
    color: colors.white,
  },

  // ==================== IMAGES ====================
  imageLarge: {
    width: 120,
    height: 120,
    borderRadius: 24,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  imageMedium: {
    width: 80,
    height: 80,
    borderRadius: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  imageSmall: {
    width: 56,
    height: 56,
    borderRadius: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.extraLight,
    borderWidth: 2,
    borderColor: colors.white,
  },

  preview: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: colors.extraLight,
  },

  // ==================== ICONS ====================
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  iconCirclePrimary: {
    backgroundColor: colors.primaryAlpha,
  },

  iconCircleSecondary: {
    backgroundColor: colors.secondaryAlpha,
  },

  iconCircleAccent: {
    backgroundColor: colors.accentAlpha,
  },

  // ==================== MODALS ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 8,
  },

  modalSubtitle: {
    fontSize: 15,
    color: colors.gray,
    textAlign: "center",
  },

  // ==================== LISTS ====================
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  listItemContent: {
    flex: 1,
    marginLeft: 16,
  },

  listItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },

  listItemSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },

  // ==================== DIVIDERS ====================
  divider: {
    height: 1,
    backgroundColor: colors.extraLight,
    marginVertical: 20,
  },

  dividerThick: {
    height: 2,
    backgroundColor: colors.extraLight,
    marginVertical: 24,
  },

  // ==================== SPACING ====================
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  mt24: { marginTop: 24 },
  
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  mb24: { marginBottom: 24 },
  
  p8: { padding: 8 },
  p12: { padding: 12 },
  p16: { padding: 16 },
  p20: { padding: 20 },
  p24: { padding: 24 },

  // ==================== FLEX ====================
  row: {
    flexDirection: "row",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  column: {
    flexDirection: "column",
  },

  alignCenter: {
    alignItems: "center",
  },

  justifyCenter: {
    justifyContent: "center",
  },

  flex1: {
    flex: 1,
  },

  // ==================== SHADOWS ====================
  shadowSm: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  shadowMd: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  shadowLg: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  shadowXl: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
});

// Export colors for use in gradient components
export { colors };