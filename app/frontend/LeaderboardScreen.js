import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const dummyData = [
  { id: "1", name: "Rahul", points: 120 },
  { id: "2", name: "Priya", points: 100 },
  { id: "3", name: "Amit", points: 90 },
  { id: "4", name: "Sneha", points: 75 },
  { id: "5", name: "Rohan", points: 60 },
];

function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
      />
    </View>
  );
}

export default LeaderboardScreen; // ✅ important!
