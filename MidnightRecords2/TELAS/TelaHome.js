import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function TelaInicio() {
  return (
    <View style={styles.container}>
      <Text>🏠 Página Inicial</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
