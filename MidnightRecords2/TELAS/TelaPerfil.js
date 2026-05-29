import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Feather from "@expo/vector-icons/Feather";

export default function TelaPerfil() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState("");
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const usuario = auth.currentUser;

    if (usuario) {
      setNome(usuario.displayName || "");
      setEmail(usuario.email || "");
      setFoto(usuario.photoURL || "");
    }

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const nomeSalvo = localStorage.getItem("nomeUsuario");
      if (nomeSalvo && !usuario?.displayName) {
        setNome(nomeSalvo);
      }
    }
  }, []);

  const salvarPerfil = async () => {
    try {
      const usuario = auth.currentUser;

      if (usuario) {
        await updateProfile(usuario, {
          displayName: nome,
          photoURL: foto,
        });
      }

      if (Platform.OS === "web" && typeof window !== "undefined") {
        localStorage.setItem("nomeUsuario", nome);
        localStorage.setItem("fotoUsuario", foto);
      }

      setEditando(false);
      Alert.alert("Perfil atualizado", "Suas informações foram salvas.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  const sairConta = async () => {
    await signOut(auth);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      localStorage.removeItem("nomeUsuario");
      localStorage.removeItem("fotoUsuario");
    }

    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatarImage} />
          ) : (
            <Feather name="user" size={42} color="#D4A74F" />
          )}
        </View>

        <Text style={styles.title}>Meu Perfil</Text>

        <Text style={styles.label}>Nome</Text>
        {editando ? (
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#aaa"
          />
        ) : (
          <Text style={styles.value}>{nome || "Usuário"}</Text>
        )}

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{email || "E-mail não encontrado"}</Text>

        {editando && (
          <>
            <Text style={styles.label}>Foto do perfil</Text>
            <TextInput
              style={styles.input}
              value={foto}
              onChangeText={setFoto}
              placeholder="Cole o link da imagem"
              placeholderTextColor="#aaa"
            />
          </>
        )}

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

        <TouchableOpacity style={styles.logoutButton} onPress={sairConta}>
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
    paddingBottom: 100,
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
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
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
  input: {
    fontFamily: "Poppins_400Regular",
    backgroundColor: "#1a1420",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.35)",
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