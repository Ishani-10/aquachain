import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../styles/styles";
import { SERVER_URL } from "../config/constants";

export default function LoginScreen({ navigation }) {
  const [agentName, setAgentName] = useState("");
  const [agentId, setAgentId] = useState("");
  const [agentPass, setAgentPass] = useState("");
  const [isExistingAgent, setIsExistingAgent] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = async () => {
    if (!agentId.trim() || !agentPass.trim() || (!isExistingAgent && !agentName.trim())) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (isExistingAgent) {
        // LOGIN
        const response = await fetch(`${SERVER_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: agentId.trim(),
            password: agentPass,
          }).toString(),
        });

        const data = await response.json();
        if (data.success) {
          Alert.alert("Success", "Login successful!");
          navigation.replace("ProjectSelection", {
            name: data.username || agentName.trim(),
            agentId,
          });
        } else {
          Alert.alert("Error", data.message || "Invalid credentials");
        }
      } else {
        // SIGNUP
        const response = await fetch(`${SERVER_URL}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: agentId.trim(),
            username: agentName.trim(),
            password: agentPass,
          }).toString(),
        });

        const data = await response.json();
        if (data.success) {
          Alert.alert("Success", "Account created successfully!");
          navigation.replace("ProjectSelection", {
            name: agentName.trim(),
            agentId,
          });
        } else {
          Alert.alert("Error", data.message || "Signup failed");
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex1}
        >
          <View style={localStyles.container}>
            {/* Top Section - Logo & Brand */}
            <Animated.View
              style={[
                localStyles.topSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={localStyles.logoContainer}>
                <View style={localStyles.logoCircle}>
                  <Ionicons name="water" size={48} color={colors.white} />
                </View>
              </View>
              <Text style={localStyles.brandTitle}>AquaChain</Text>
              <Text style={localStyles.brandSubtitle}>
                India’s Blue Carbon Ledger
              </Text>
            </Animated.View>

            {/* Bottom Section - Form */}
            <Animated.View
              style={[
                localStyles.formSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.glassCard}>
                {/* Toggle Buttons */}
                <View style={localStyles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      localStyles.toggleButton,
                      isExistingAgent && localStyles.toggleActive,
                    ]}
                    onPress={() => setIsExistingAgent(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="log-in-outline"
                      size={20}
                      color={isExistingAgent ? colors.white : colors.gray}
                    />
                    <Text
                      style={[
                        localStyles.toggleText,
                        isExistingAgent && localStyles.toggleTextActive,
                      ]}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      localStyles.toggleButton,
                      !isExistingAgent && localStyles.toggleActive,
                    ]}
                    onPress={() => setIsExistingAgent(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color={!isExistingAgent ? colors.white : colors.gray}
                    />
                    <Text
                      style={[
                        localStyles.toggleText,
                        !isExistingAgent && localStyles.toggleTextActive,
                      ]}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Name Input (Signup only) */}
                {!isExistingAgent && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={localStyles.inputWrapper}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.gray}
                        style={localStyles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, localStyles.inputWithIcon]}
                        placeholder="Enter your full name"
                        placeholderTextColor={colors.lightGray}
                        value={agentName}
                        onChangeText={setAgentName}
                      />
                    </View>
                  </View>
                )}

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={localStyles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.gray}
                      style={localStyles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, localStyles.inputWithIcon]}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.lightGray}
                      value={agentId}
                      onChangeText={setAgentId}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={localStyles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.gray}
                      style={localStyles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, localStyles.inputWithIcon]}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.lightGray}
                      value={agentPass}
                      onChangeText={setAgentPass}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={localStyles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={colors.gray}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleContinue}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <Text style={styles.buttonText}>Please wait...</Text>
                    ) : (
                      <View style={localStyles.buttonContent}>
                        <Text style={styles.buttonText}>
                          {isExistingAgent ? "Login" : "Create Account"}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color={colors.white}
                        />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Forgot Password (Login only) */}
                {isExistingAgent && (
                  <TouchableOpacity style={localStyles.forgotPassword}>
                    <Text style={localStyles.forgotPasswordText}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const localStyles = {
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  topSection: {
    alignItems: "center",
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: -1,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  brandSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    fontWeight: "500",
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.extraLight,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray,
  },
  toggleTextActive: {
    color: colors.white,
  },
  inputWrapper: {
    position: "relative",
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 18,
    zIndex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 18,
    zIndex: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
};