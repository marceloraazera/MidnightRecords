import React, { useState } from "react";
import { View, Text, Image, ImageBackground, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, Modal } from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
  const [focusedInput, setFocusedInput] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  const traduzirErro = (errorCode) => {
    const erros = {
      "auth/invalid-credential": "E-mail ou senha incorretos. Tente novamente.",
      "auth/user-not-found": "Usuário não encontrado. Verifique seu e-mail.",
      "auth/wrong-password": "Senha incorreta. Tente novamente.",
      "auth/email-already-in-use": "Este e-mail já está cadastrado.",
      "auth/weak-password": "Senha fraca. Use no mínimo 6 caracteres.",
      "auth/invalid-email": "E-mail inválido. Verifique o formato.",
      "auth/operation-not-allowed": "Operação não permitida. Tente mais tarde.",
      "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.",
    };
    return erros[errorCode] || "Erro ao processar. Tente novamente mais tarde.";
  };

  function showFeedback(title, text) {
    const finalMessage = text || title;
    setMessage(finalMessage);
    setMessageType(title === "Erro" ? "error" : "success");
    
    setTimeout(() => setMessage(""), 4000);
  }

  async function fazerLogin() {
    if (!email || !senha) {
      showFeedback("Erro", "Preencha e-mail e senha para continuar.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      showFeedback("Sucesso", "Login realizado!");
      router.push("/(tabs)");
    } catch (error) {
      console.log("Login erro", error);
      const errorCode = error?.code || "auth/unknown-error";
      const mensagemAmigavel = traduzirErro(errorCode);
      showFeedback("Erro", mensagemAmigavel);
    }
  }

  async function recuperarSenha() {
    if (!emailRecuperacao) {
      showFeedback("Erro", "Digite um e-mail para recuperar a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailRecuperacao);
      showFeedback("Sucesso", `Link de recuperação enviado para ${emailRecuperacao}`);
      setShowForgotPassword(false);
      setEmailRecuperacao("");
    } catch (error) {
      console.log("Erro ao recuperar senha", error);
      const errorCode = error?.code || "auth/unknown-error";
      const mensagemAmigavel = traduzirErro(errorCode);
      showFeedback("Erro", mensagemAmigavel);
    }
  }

  return (
    <>
      <ImageBackground
        source={require("../assets/imagensMR/fundo-escuro.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/imagensMR/logo-completa-midnight.png")}
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
              <View style={[styles.inputContainer, focusedInput === "email" && styles.inputContainerFocused]}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={[styles.inputContainer, focusedInput === "senha" && styles.inputContainerFocused]}>
                <Text style={styles.inputIcon}><Feather name="lock" size={18} color="#4CAF7F" /></Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={senha}
                  onChangeText={setSenha}
                  onFocus={() => setFocusedInput("senha")}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Enter Button */}
            <TouchableOpacity style={styles.button} onPress={fazerLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Forgot Password Button */}
            <TouchableOpacity onPress={() => setShowForgotPassword(true)} style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {message ? (
          <View style={[styles.messageContainer, messageType === "error" ? styles.messageError : styles.messageSuccess]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
      </ImageBackground>

      <Modal
        visible={showForgotPassword}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowForgotPassword(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Recuperar Senha</Text>
            <Text style={styles.modalSubtitle}>Digite seu e-mail para receber um link de recuperação</Text>

            <View style={styles.modalInputWrapper}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <View style={styles.modalInputContainer}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                  value={emailRecuperacao}
                  onChangeText={setEmailRecuperacao}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={recuperarSenha}>
              <Text style={styles.buttonText}>Enviar Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  inputContainerFocused: {
    backgroundColor: "transparent",
    borderColor: "#4CAF7F",
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
    outline: 'none',
    padding: 0,
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
  forgotPasswordButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#D4A74F",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  messageContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  messageSuccess: {
    backgroundColor: "rgba(76, 175, 127, 0.95)",
    borderWidth: 1,
    borderColor: "#4CAF7F",
  },
  messageError: {
    backgroundColor: "rgba(255, 107, 107, 0.95)",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  messageText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#221F1A",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#D4A74F",
  },
  modalCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(212, 167, 79, 0.1)",
  },
  modalCloseText: {
    fontSize: 20,
    color: "#D4A74F",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#D4A74F",
    marginBottom: 8,
    letterSpacing: 1,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#CCF7E4",
    marginBottom: 20,
    lineHeight: 18,
  },
  modalInputWrapper: {
    marginBottom: 20,
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF7F",
    borderRadius: 25,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    height: 48,
  },
  modalButton: {
    backgroundColor: "#D4A74F",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "rgba(212, 167, 79, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});