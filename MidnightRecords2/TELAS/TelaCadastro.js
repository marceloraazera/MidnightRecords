import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

const saveUserData = async (nome, email) => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("emailUsuario", email);
  }
};

export default function TelaCadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [activeTab, setActiveTab] = useState("cadastro");
  const [focusedInput, setFocusedInput] = useState(null);

  const traduzirErro = (errorCode) => {
    const erros = {
      "auth/email-already-in-use": "Este e-mail já está cadastrado. Faça login ou use outro e-mail.",
      "auth/weak-password": "Senha fraca. Use no mínimo 6 caracteres.",
      "auth/invalid-email": "E-mail inválido. Verifique o formato.",
      "auth/operation-not-allowed": "Operação não permitida. Tente mais tarde.",
      "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.",
    };

    return erros[errorCode] || "Erro ao cadastrar. Tente novamente mais tarde.";
  };

  function showFeedback(title, text) {
    const finalMessage = text || title;
    setMessage(finalMessage);
    setMessageType(title === "Erro" ? "error" : "success");

    setTimeout(() => setMessage(""), 4000);
  }

  async function cadastrar() {
  if (!nome || !email || !senha) {
    showFeedback("Erro", "Preencha nome, e-mail e senha para continuar.");
    return;
  }

  try {
    const credencial = await createUserWithEmailAndPassword(auth, email, senha);

    await updateProfile(credencial.user, {
      displayName: nome,
    });

    await setDoc(doc(db, "usuarios", credencial.user.uid), {
      nome: nome,
      email: email,
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      criadoEm: new Date().toISOString(),
    });

    await saveUserData(nome, email);

    router.push("/(tabs)");
  } catch (error) {
    console.log("Cadastro erro", error);
    const errorCode = error?.code || "auth/unknown-error";
    const mensagemAmigavel = traduzirErro(errorCode);
    showFeedback("Erro", mensagemAmigavel);
  }
}

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/imagensMR/logo-completa-midnight.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "login" && styles.tabActive]}
            onPress={() => {
              setActiveTab("login");
              router.push("/");
            }}
          >
            <Text style={[styles.tabText, activeTab === "login" && styles.tabTextActive]}>
              LOGIN
            </Text>
            {activeTab === "login" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "cadastro" && styles.tabActive]}
            onPress={() => setActiveTab("cadastro")}
          >
            <Text style={[styles.tabText, activeTab === "cadastro" && styles.tabTextActive]}>
              CADASTRO
            </Text>
            {activeTab === "cadastro" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome</Text>
            <View style={[styles.inputContainer, focusedInput === "nome" && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>
                <Feather name="user" size={20} color="#4CAF7F" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="seu nome"
                placeholderTextColor="#999"
                value={nome}
                onChangeText={setNome}
                onFocus={() => setFocusedInput("nome")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

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

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={[styles.inputContainer, focusedInput === "senha" && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>
                <Feather name="lock" size={18} color="#4CAF7F" />
              </Text>
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

          <TouchableOpacity style={styles.button} onPress={cadastrar}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {message ? (
          <View
            style={[
              styles.messageContainer,
              messageType === "error" ? styles.messageError : styles.messageSuccess,
            ]}
          >
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
      </View>
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
    fontFamily: "Poppins_700Bold",
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
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 1.5,
  },
  tabTextActive: {
    fontFamily: "Poppins_700Bold",
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
    backgroundColor: "rgba(10, 15, 30, 0.65)",
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212, 167, 79, 0.24)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 10,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    fontWeight: "600",
    color: "#D4A74F",
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 127, 0.45)",
    borderRadius: 25,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    height: 52,
  },
  inputContainerFocused: {
    backgroundColor: "rgba(76, 175, 127, 0.18)",
    borderColor: "#D4A74F",
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: "#4CAF7F",
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#ffeabf",
    fontWeight: "500",
    outlineWidth: 0,
    outlineStyle: "none",
    outlineColor: "transparent",
    padding: 0,
  },
  button: {
    backgroundColor: "#D4A74F",
    minHeight: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 24,
    shadowColor: "rgba(212, 167, 79, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1a0f2e",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
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
    fontFamily: "Poppins_500Medium",
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
});