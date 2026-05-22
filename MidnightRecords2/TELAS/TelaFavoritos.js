import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

const getUserName = async () => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return localStorage.getItem("nomeUsuario");
  }
  return "";
};

export default function TelaFavoritos() {
  const [nome, setNome] = useState("");

  useEffect(() => {
    const obterNome = async () => {
      try {
        const nomeArmazenado = await getUserName();
        if (nomeArmazenado) {
          setNome(nomeArmazenado);
        }
      } catch (error) {
        console.log("Erro ao obter nome:", error);
      }
    };

    obterNome();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos de {nome}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1445",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    color: "#F1F6B3",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 38,
  },
});
