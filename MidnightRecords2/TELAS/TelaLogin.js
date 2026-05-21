import React, { useState } from "react";
import { View, Text, Image, ImageBackground, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

export default function TelaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [activeTab, setActiveTab] = useState("login");

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

  async function fazerLogin() {
    if (!email || !senha) {
      showFeedback("Erro", "Preencha e-mail e senha para continuar.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      showFeedback("Sucesso", "Login realizado!");
      router.push("/explore");
    } catch (error) {
      console.log("Login erro", error);
      const errorCode = error?.code || "auth/unknown-error";
      const errorMessage = error?.message || String(error);
      showFeedback("Erro", `${errorCode}: ${errorMessage}`);
    }
  }

  return (
    <ImageBackground
      source={require("../imagensMR/fundo-escuro.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(45,27,27,0.85)", "rgba(26,15,46,0.85)", "rgba(15,26,46,0.85)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientOverlay}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../imagensMR/logo-completa-midnight.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "login" && styles.tabActive]}
            onPress={() => setActiveTab("login")}
          >
            <Text style={[styles.tabText, activeTab === "login" && styles.tabTextActive]}>LOGIN</Text>
            {activeTab === "login" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === "cadastro" && styles.tabActive]}
            onPress={() => {
              setActiveTab("cadastro");
              router.push("/cadastro");
            }}
          >
            <Text style={[styles.tabText, activeTab === "cadastro" && styles.tabTextActive]}>CADASTRO</Text>
            {activeTab === "cadastro" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}><Feather name="lock" size={18} color="#4CAF7F" /></Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>
          </View>

          {/* Enter Button */}
          <TouchableOpacity style={styles.button} onPress={fazerLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          {/* Message */}
          {message ? (
            <Text style={messageType === "error" ? styles.errorText : styles.successText}>
              {message}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#1a0f2e",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoImage: {
    width: 360,
    height: 220,
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: "#D4A74F",
    letterSpacing: 3,
    textShadowColor: "rgba(212, 167, 79, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoSubtitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#D4A74F",
    letterSpacing: 3,
    textShadowColor: "rgba(212, 167, 79, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D4A74F",
    marginBottom: 40,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#D4A74F",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 1.5,
  },
  tabTextActive: {
    color: "#D4A74F",
    fontWeight: "700",
  },
  tabUnderline: {
    position: "absolute",
    bottom: -3,
    height: 3,
    backgroundColor: "#D4A74F",
    width: "100%",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D4A74F",
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF7F",
    borderRadius: 25,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    height: 48,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: "#4CAF7F",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    outlineWidth: 0,
  },
  button: {
    backgroundColor: "#D4A74F",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
    shadowColor: "rgba(212, 167, 79, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#1a0f2e",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },
  successText: {
    color: "#4CAF7F",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
});