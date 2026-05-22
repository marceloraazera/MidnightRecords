import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useProdutosContext } from "../context/ProdutosContext";

let ImagePicker = null;
if (Platform.OS !== 'web') {
  ImagePicker = require('expo-image-picker');
}

export default function TelaCadastroAdmin() {
  const router = useRouter();
  const { adicionarProduto } = useProdutosContext();
  
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [linkImagem, setLinkImagem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const selecionarImagem = async () => {
    if (!ImagePicker) {
      Alert.alert("Aviso", "Seleção de imagens não disponível na web. Use o campo de URL.");
      return;
    }

    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (resultado && !resultado.canceled && resultado.assets[0]) {
        const asset = resultado.assets[0];
        setImagePreview(asset.uri);
        setLinkImagem(asset.uri);
      }
    } catch (error) {
      console.warn("Image picker error:", error);
    }
  };

  const cancelar = () => {
    router.back();
  };

  const salvarProduto = async () => {
    if (!titulo.trim()) {
      Alert.alert("Erro", "Informe o título do produto");
      return;
    }
    if (!preco.trim()) {
      Alert.alert("Erro", "Informe o preço do produto");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const imagem = imagePreview || linkImagem || "🎵";

      console.log("Salvando produto com dados:", {
        nome: titulo,
        preco: preco,
        imagem,
      });

      await adicionarProduto({
        nome: titulo,
        preco: preco,
        imagem,
        descricao: descricao,
        linkImagem: linkImagem,
      });

      console.log("Produto salvo com sucesso!");
      
      setTitulo("");
      setPreco("");
      setLinkImagem("");
      setDescricao("");
      setImagePreview(null);
      
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 500);
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Erro ao salvar produto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={cancelar} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar produto</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INFORMAÇÕES BÁSICAS</Text>
          <Text style={styles.sectionSubtitle}>Título do produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Disco Luz Djavan"
            placeholderTextColor="#666"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREÇO</Text>
          <Text style={styles.sectionSubtitle}>Preço do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: R$ 250,00"
            placeholderTextColor="#666"
            value={preco}
            onChangeText={setPreco}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FOTOS DO PRODUTO</Text>
          <Text style={styles.sectionSubtitle}>Link da imagem</Text>
          
          {imagePreview && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imagePreview }}
                style={styles.imagePreview}
              />
            </View>
          )}
          
          <TouchableOpacity style={styles.imageSelectorButton} onPress={selecionarImagem}>
            <Text style={styles.imageSelectorButtonText}>📁 Selecionar Imagem</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="URL da imagem"
            placeholderTextColor="#666"
            value={linkImagem}
            onChangeText={setLinkImagem}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
          <Text style={styles.sectionSubtitle}>Descrição do produto</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Produto novo, importado..."
            placeholderTextColor="#666"
            value={descricao}
            onChangeText={setDescricao}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
          />
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
            <Text style={styles.saveButtonText}>{loading ? "Salvando..." : "Salvar produto"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a1f2f",
  },
  
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#1a1420",
    borderBottomWidth: 1,
    borderBottomColor: "#3d3341",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 32,
    color: "#d4af37",
    fontWeight: "bold",
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: "Poppins_600SemiBold",
    backgroundColor: "#8b6f47",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontFamily: "Poppins_500Medium",
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 10,
  },

  input: {
    fontFamily: "Poppins_400Regular",
    backgroundColor: "#1a1420",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#3d3341",
    fontSize: 14,
  },

  textArea: {
    paddingTop: 14,
    minHeight: 140,
  },

  imagePreviewContainer: {
    marginBottom: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#1a1420",
  },
  imageSelectorButton: {
    backgroundColor: "#3d3341",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8b6f47",
  },
  imageSelectorButtonText: {
    fontFamily: "Poppins_500Medium",
    color: "#d4af37",
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
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#2d6a5c",
  },
  cancelButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#c97a3f",
  },
  saveButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
