// components/WorkTypeModal.js - FIXED VERSION
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/styles";

export default function WorkTypeModal({
  visible,
  onClose,
  workType,
  onSelect,
  workTypeOptions,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={localStyles.modalOverlay}>
        <View style={localStyles.modalContainer}>
          {/* Header */}
          <View style={localStyles.modalHeader}>
            <Text style={localStyles.modalTitle}>Select Work Type</Text>
            <TouchableOpacity onPress={onClose} style={localStyles.closeButton}>
              <Ionicons name="close" size={28} color={colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Work Type Options */}
          <ScrollView 
            style={localStyles.optionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {workTypeOptions.map((option) => {
              const isSelected = workType === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    localStyles.optionCard,
                    isSelected && {
                      backgroundColor: option.color + "15",
                      borderColor: option.color,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => onSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={localStyles.optionContent}>
                    {/* Icon Circle */}
                    <View
                      style={[
                        localStyles.iconCircle,
                        { backgroundColor: option.color + "20" },
                      ]}
                    >
                      <Text style={localStyles.iconText}>{option.icon}</Text>
                    </View>

                    {/* Text */}
                    <View style={localStyles.textContainer}>
                      <Text
                        style={[
                          localStyles.optionLabel,
                          isSelected && { color: option.color, fontWeight: "700" },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>

                    {/* Check Mark */}
                    {isSelected && (
                      <View style={localStyles.checkContainer}>
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color={option.color}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: "75%",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLight,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.extraLight,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.extraLight,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
  },
  checkContainer: {
    marginLeft: 12,
  },
});