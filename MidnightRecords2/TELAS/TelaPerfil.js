import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import Feather from "@expo/vector-icons/Feather";

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

      if (!usuario) {
        return;
      }

      setNome(usuario.displayName || "");
      setEmail(usuario.email || "");

      const documentoRef = doc(db, "usuarios", usuario.uid);
      const documento = await getDoc(documentoRef);

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

  const sairConta = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.log("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  const CampoTexto = ({ label, value, onChangeText, editable = true, keyboardType = "default" }) => {
    return (
      <>
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
          <Text style={styles.value}>{value || "Não informado"}</Text>
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Feather name="user" size={42} color="#D4A74F" />
        </View>

        <Text style={styles.title}>Meu Perfil</Text>

        <CampoTexto
          label="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <CampoTexto
          label="E-mail"
          value={email}
          editable={false}
        />

        <CampoTexto
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <CampoTexto
          label="CEP"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
        />

        <CampoTexto
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />

        <CampoTexto
          label="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />

        <CampoTexto
          label="Complemento"
          value={complemento}
          onChangeText={setComplemento}
        />

        <CampoTexto
          label="Cidade"
          value={cidade}
          onChangeText={setCidade}
        />

        <CampoTexto
          label="Estado"
          value={estado}
          onChangeText={setEstado}
        />

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
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditando(false)}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1445",
  },
  content: {
    padding: 24,
    paddingBottom: 110,
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
    fontSize: 16,
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