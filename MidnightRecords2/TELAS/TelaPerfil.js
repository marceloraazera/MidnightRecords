import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import Feather from "@expo/vector-icons/Feather";

function CampoTexto({
  label,
  value,
  onChangeText,
  editando,
  editable = true,
  keyboardType = "default",
}) {
  return (
    <View style={styles.fieldBox}>
      <Text style={styles.label}>{label}</Text>

      {editando && editable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
        />
      ) : (
        <View style={styles.fieldValueBox}>
          <Text style={styles.value}>{value?.trim() ? value : "Não informado"}</Text>
        </View>
      )}
    </View>
  );
}

export default function TelaPerfil() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const usuario = auth.currentUser;
      if (!usuario) return;

      setNome(usuario.displayName || "");
      setEmail(usuario.email || "");

      const documento = await getDoc(doc(db, "usuarios", usuario.uid));

      if (documento.exists()) {
        const dados = documento.data();

        setNome(dados.nome || usuario.displayName || "");
        setEmail(dados.email || usuario.email || "");
        setTelefone(dados.telefone || "");
        setCep(dados.cep || "");
        setEndereco(dados.endereco || "");
        setNumero(dados.numero || "");
        setComplemento(dados.complemento || "");
        setCidade(dados.cidade || "");
        setEstado(dados.estado || "");
      }
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
    }
  };

  const salvarPerfil = async () => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      await updateProfile(usuario, {
        displayName: nome,
      });

      await setDoc(
        doc(db, "usuarios", usuario.uid),
        {
          nome,
          email: usuario.email,
          telefone,
          cep,
          endereco,
          numero,
          complemento,
          cidade,
          estado,
          atualizadoEm: new Date().toISOString(),
        },
        { merge: true }
      );

      setEmail(usuario.email || "");
      setEditando(false);

      Alert.alert("Perfil atualizado", "Suas informações foram salvas.");
    } catch (error) {
      console.log("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  const cancelarEdicao = () => {
    setEditando(false);
    carregarPerfil();
  };

const sairConta = async () => {
  try {
    await signOut(auth);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
      return;
    }

    router.replace("/");
  } catch (error) {
    console.log("Erro ao sair:", error);
  }
};

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.card}>
          <View style={styles.headerSection}>
            <View style={styles.avatar}>
              <Feather name="user" size={42} color="#D4A74F" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Meu Perfil</Text>
              <Text style={styles.subtitle}>Atualize seus dados e mantenha seu cadastro alinhado ao estilo da loja.</Text>
            </View>
          </View>

          <CampoTexto label="Nome" value={nome} onChangeText={setNome} editando={editando} />
          <CampoTexto label="E-mail" value={email} editando={editando} editable={false} />

          <Text style={styles.sectionTitle}>Contato</Text>
          <CampoTexto label="Telefone" value={telefone} onChangeText={setTelefone} editando={editando} keyboardType="phone-pad" />
          <CampoTexto label="CEP" value={cep} onChangeText={setCep} editando={editando} keyboardType="numeric" />

          <Text style={styles.sectionTitle}>Endereço</Text>
          <CampoTexto label="Endereço" value={endereco} onChangeText={setEndereco} editando={editando} />
          <CampoTexto label="Número" value={numero} onChangeText={setNumero} editando={editando} keyboardType="numeric" />
          <CampoTexto label="Complemento" value={complemento} onChangeText={setComplemento} editando={editando} />
          <CampoTexto label="Cidade" value={cidade} onChangeText={setCidade} editando={editando} />
          <CampoTexto label="Estado" value={estado} onChangeText={setEstado} editando={editando} />

        {editando ? (
          <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
            <Feather name="save" size={18} color="#D4A74F" />
            <Text style={styles.buttonText}>Salvar perfil</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
            <Feather name="edit-2" size={18} color="#D4A74F" />
            <Text style={styles.buttonText}>Editar perfil</Text>
          </TouchableOpacity>
        )}

        {editando && (
          <TouchableOpacity style={styles.cancelButton} onPress={cancelarEdicao}>
            <Feather name="x" size={18} color="#CCF7E4" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={sairConta}>
          <Feather name="log-out" size={18} color="#D4A74F" />
          <Text style={styles.buttonText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 24,
    paddingBottom: 110,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(8, 8, 22, 0.82)",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.22)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(212,167,79,0.16)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.35)",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    color: "#F1F6B3",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#CCF7E4",
    lineHeight: 20,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#CCF7E4",
    marginBottom: 12,
    marginTop: 8,
  },
  fieldsRow: {
    flexDirection: "column",
  },
  fieldHalf: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#D4A74F",
    marginBottom: 8,
  },
  value: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: "#F4F7F0",
  },
  fieldBox: {
    marginBottom: 18,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(20, 14, 44, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.14)",
  },
  fieldValueBox: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 14,
  },
  input: {
    fontFamily: "Poppins_400Regular",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.25)",
    marginTop: 6,
  },
  button: {
    marginTop: 28,
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
  cancelButton: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "rgba(204,247,228,0.08)",
    borderWidth: 1,
    borderColor: "rgba(204,247,228,0.25)",
  },
  cancelButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#CCF7E4",
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "rgba(212,167,79,0.08)",
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.25)",
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#D4A74F",
    fontSize: 14,
  },
});