import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useRouter } from "expo-router";

export default function TelaCadastro() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  function showFeedback(title, text) {
    const finalMessage = text || title;
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.alert(`${title}: ${finalMessage}`);
      }
    } else {
      Alert.alert(title, finalMessage);
    }
    setMessage(`${title}: ${finalMessage}`);
    setMessageType(title === "Erro" ? "error" : "success");
  }

  async function cadastrar() {
    if (!email || !senha) {
      showFeedback("Erro", "Preencha e-mail e senha para continuar.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);

      showFeedback("Sucesso", "Conta criada!");

      router.push("/");
    } catch (error) {
      console.log("Cadastro erro", error);
      const errorCode = error?.code || "auth/unknown-error";
      const errorMessage = error?.message || String(error);
      showFeedback("Erro", `${errorCode}: ${errorMessage}`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {message ? (
        <Text style={messageType === "error" ? styles.errorText : styles.successText}>
          {message}
        </Text>
      ) : null}

      <TouchableOpacity onPress={() => router.push("/") }>
        <Text style={styles.link}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1445",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#F1F6B3",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 28,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FCA311",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#1C1445",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#F1F6B3",
    textAlign: "center",
    marginTop: 20,
  },
  successText: {
    color: "#A3E635",
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    color: "#F87171",
    textAlign: "center",
    marginTop: 16,
  },
});