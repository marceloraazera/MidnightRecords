import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
 
  Alert,
  
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useProdutosContext } from "../context/ProdutosContext";
import { auth } from "../config/firebaseConfig";

let ImagePicker = null;

if (Platform.OS !== "web") {
  ImagePicker = require("expo-image-picker");
}

export default function TelaCadastroAdmin() {
  const router = useRouter();
  const { adicionarProduto } = useProdutosContext();

  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [linkImagem, setLinkImagem] = useState("");
const [imagens, setImagens] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

const selecionarImagem = async () => {
  if (!ImagePicker) {
    Alert.alert(
      "Aviso",
      "Seleção de imagens não disponível na web."
    );
    return;
  }

  if (imagens.length >= 3) {
    Alert.alert(
      "Limite atingido",
      "Você pode adicionar apenas 3 imagens."
    );
    return;
  }

  try {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const novaImagem = resultado.assets[0].uri;

      setImagens(prev => [...prev, novaImagem]);
    }
  } catch (error) {
    console.log(error);
  }
};

  const cancelar = () => {
    router.back();
  };

  const salvarProduto = async () => {
    if (!titulo.trim()) {
  Alert.alert("Erro", "Informe o nome do produto");
  return;
}

if (!preco.trim()) {
  Alert.alert("Erro", "Informe o preço do produto");
  return;
}

if (!descricao.trim()) {
  Alert.alert("Erro", "Informe a descrição do produto");
  return;
}

if (imagens.length !== 3) {
  Alert.alert(
    "Erro",
    "É obrigatório adicionar exatamente 3 imagens."
  );
  return;
}

    setLoading(true);

    try {
      const usuario = auth.currentUser;
      if (!usuario) {
        Alert.alert("Erro", "Você precisa estar logado para cadastrar um produto.");
        setLoading(false);
        return;
      }

     

      await adicionarProduto({
  nome: titulo,
  preco,
  descricao,
  imagem: imagens[0],
  imagens,
});

      setTitulo("");
setPreco("");
setDescricao("");
setImagens([]);
setLinkImagem("");

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      Alert.alert("Erro", "Erro ao salvar produto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/imagensMR/logo-completa-midnight.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleBar}>
          <TouchableOpacity onPress={cancelar} style={styles.backButton}>
            <Feather name="chevron-left" size={26} color="#F1F6B3" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Cadastrar produto</Text>
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.pageSubtitle}>Adicione um novo disco à vitrine com imagem, preço e descrição.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Título do produto</Text>
            <View style={[styles.inputContainer, focusedInput === "titulo" && styles.inputContainerFocused]}>
              <TextInput
                style={styles.input}
                placeholder="Ex: Disco Luz Djavan"
                placeholderTextColor="#D8E3C3"
                value={titulo}
                onChangeText={setTitulo}
                onFocus={() => setFocusedInput("titulo")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Preço do produto</Text>
            <View style={[styles.inputContainer, focusedInput === "preco" && styles.inputContainerFocused]}>
              <TextInput
                style={styles.input}
                placeholder="Ex: R$ 250,00"
                placeholderTextColor="#D8E3C3"
                value={preco}
                onChangeText={setPreco}
                onFocus={() => setFocusedInput("preco")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
  <Text style={styles.inputLabel}>Fotos do produto</Text>

  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 12,
    }}
  >
    {imagens.map((img, index) => (
      <Image
        key={index}
        source={{ uri: img }}
        style={{
          width: 90,
          height: 90,
          borderRadius: 12,
        }}
      />
    ))}
  </View>

  <View
    style={[
      styles.inputContainer,
      focusedInput === "linkImagem" &&
        styles.inputContainerFocused,
    ]}
  >
    <TextInput
      style={styles.input}
      placeholder="Cole a URL da imagem"
      placeholderTextColor="#D8E3C3"
      value={linkImagem}
      onChangeText={setLinkImagem}
      onFocus={() => setFocusedInput("linkImagem")}
      onBlur={() => setFocusedInput(null)}
    />
  </View>

  <TouchableOpacity
    style={[
      styles.imageSelectorButton,
      { marginTop: 12 }
    ]}
    onPress={() => {
      if (!linkImagem.trim()) {
        Alert.alert("Erro", "Informe a URL da imagem.");
        return;
      }

      if (imagens.length >= 3) {
        Alert.alert(
          "Erro",
          "Você só pode adicionar 3 imagens."
        );
        return;
      }

      setImagens([...imagens, linkImagem.trim()]);
      setLinkImagem("");
    }}
  >
    <Text style={styles.imageSelectorButtonText}>
      Adicionar imagem ({imagens.length}/3)
    </Text>
  </TouchableOpacity>
</View>
            
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer, focusedInput === "descricao" && styles.inputContainerFocused]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Produto novo, importado..."
                placeholderTextColor="#D8E3C3"
                value={descricao}
                onChangeText={setDescricao}
                onFocus={() => setFocusedInput("descricao")}
                onBlur={() => setFocusedInput(null)}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelar}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={salvarProduto}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Salvando..." : "Salvar produto"}
              </Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#300322",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: "center",

  },
  logoImage: {
    width: 640,
    height: 200,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(241,246,179,0.25)",
    paddingVertical: 18,
    marginBottom: 20,
    marginHorizontal: -24,
  },
  backButton: {
    position: "absolute",
    left: 20,
    padding: 8,
  },
  pageTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    color: "#F1F6B3",
    textAlign: "center",
  },
  subtitleContainer: {
    marginBottom: 26,
  },
  pageSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#CCF7E4",
    lineHeight: 20,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "rgba(8, 8, 22, 0.76)",
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212,167,79,0.18)",
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
    color: "#CCF7E4",
    fontSize: 13,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(241,246,179,0.08)",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(241,246,179,0.1)",
    paddingHorizontal: 16,
    minHeight: 52,
  },
  inputContainerFocused: {
    borderColor: "rgba(223,159,88,0.9)",
    backgroundColor: "rgba(241,246,179,0.12)",
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  section: {
    marginBottom: 24,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "rgba(48, 3, 34, 0.78)",
    borderWidth: 1,
    borderColor: "rgba(241,246,179,0.16)",
  },
  sectionLabel: {
    fontFamily: "Poppins_600SemiBold",
    backgroundColor: "#DF9F58",
    color: "#300322",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 13,
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 12,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionSubtitle: {
    fontFamily: "Poppins_500Medium",
    color: "#E4F9EA",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    color: "#F1F6B3",
    fontSize: 14,
    fontWeight: "500",
    outlineWidth: 0,
    outlineStyle: "none",
    outlineColor: "transparent",
    padding: 0,
  },
  textArea: {
    minHeight: 120,
    width: "100%",
  },
  imagePreviewContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(241,246,179,0.16)",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#1a1420",
  },
  imageSelectorButton: {
    backgroundColor: "rgba(24, 107, 89, 0.9)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(223, 159, 88, 0.9)",
  },
  imageSelectorButtonText: {
    fontFamily: "Poppins_500Medium",
    color: "#F1F6B3",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
    marginTop: 24,
  },
  button: {
    flex: 1,
    minHeight: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(212, 167, 79, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: "#186B59",
    borderWidth: 1,
    borderColor: "rgba(241,246,179,0.18)",
  },
  cancelButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#F1F6B3",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#DF9F58",
    borderWidth: 1,
    borderColor: "rgba(48,3,34,0.18)",
  },
  saveButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#300322",
    fontSize: 14,
    fontWeight: "600",
  },
});