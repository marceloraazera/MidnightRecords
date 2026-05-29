import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Feather from "@expo/vector-icons/Feather";

export default function TelaPerfil() {
  const router = useRouter();
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const nomeSalvo = localStorage.getItem("nomeUsuario");
      if (nomeSalvo) {
        setNome(nomeSalvo);
      }
    }
  }, []);

  const sairConta = async () => {
    try {
      await signOut(auth);

      if (Platform.OS === "web" && typeof window !== "undefined") {
        localStorage.removeItem("nomeUsuario");
      }

      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Feather name="user" size={42} color="#D4A74F" />
        </View>

        <Text style={styles.title}>Meu Perfil</Text>

        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{nome || "Usuário"}</Text>

        <Text style={styles.label}>Aplicativo</Text>
        <Text style={styles.value}>Midnight Records</Text>

        <TouchableOpacity style={styles.button} onPress={sairConta}>
          <Feather name="log-out" size={18} color="#D4A74F" />
          <Text style={styles.buttonText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
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

  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.25)",
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(212,167,79,0.12)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    color: "#F1F6B3",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#D4A74F",
    marginTop: 12,
  },

  value: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
    marginTop: 4,
  },

  button: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "rgba(212,167,79,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.4)",
  },

  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#D4A74F",
    fontSize: 14,
  },
});