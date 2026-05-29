import React from "react";
import { View, Text, Image, ImageBackground, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useProdutosContext } from "../context/ProdutosContext";

const imagemSources = {
  "Disco1-1.png": require("../assets/discos/Disco1-1.png"),
  "Disco1-2.png": require("../assets/discos/Disco1-2.png"),
  "Disco1-3.png": require("../assets/discos/Disco1-3.png"),
  "Disco2-1.png": require("../assets/discos/Disco2-1.png"),
  "Disco2-2.png": require("../assets/discos/Disco2-2.png"),
  "Disco2-3.png": require("../assets/discos/Disco2-3.png"),
  "Disco3-1.png": require("../assets/discos/Disco3-1.png"),
  "Disco3-2.png": require("../assets/discos/Disco3-2.png"),
  "Disco3-3.png": require("../assets/discos/Disco3-3.png"),
  "Disco4-1.png": require("../assets/discos/Disco4-1.png"),
  "Disco4-2.png": require("../assets/discos/Disco4-2.png"),
  "Disco4-3.png": require("../assets/discos/Disco4-3.png"),
};

const imagemFallbackById = {
  "the-queen-is-dead": imagemSources["Disco1-1.png"],
  "super-real-me": imagemSources["Disco2-1.png"],
  "ocean-blvd": imagemSources["Disco3-1.png"],
  guts: imagemSources["Disco4-1.png"],
  1: imagemSources["Disco1-1.png"],
  2: imagemSources["Disco2-1.png"],
  3: imagemSources["Disco3-1.png"],
  4: imagemSources["Disco4-1.png"],
};

const imagemFallbackByNome = {
  "The Queen Is Dead": imagemSources["Disco1-1.png"],
  "Super Real Me": imagemSources["Disco2-1.png"],
  "Ocean Blvd": imagemSources["Disco3-1.png"],
  "GUTS": imagemSources["Disco4-1.png"],
};

const defaultAlbumImage = require("../assets/discos/Disco1-1.png");

const sanitizeImageName = (imagemNome) => {
  if (!imagemNome || typeof imagemNome !== "string") {
    return null;
  }

  const trimmed = imagemNome.trim();
  if (!trimmed) {
    return null;
  }

  const fileName = trimmed.replace(/^.*[\/]/, "").replace(/\s*-\s*/g, "-");
  return imagemSources[fileName] ?? imagemSources[fileName.toLowerCase()] ?? null;
};

const getImageSource = (imagemNome, produtoId, produtoNome) => {
  const fonte = sanitizeImageName(imagemNome);
  if (fonte) {
    return fonte;
  }
  return imagemFallbackById[produtoId] ?? imagemFallbackByNome[produtoNome] ?? null;
};

const formatPrice = (value) => {
  return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
};

export default function DetalhesProduto() {
  const router = useRouter();
  const rawParams = useLocalSearchParams();
  const paramsId = Array.isArray(rawParams.id) ? rawParams.id[0] : rawParams.id;
  const { produtos, loading } = useProdutosContext();

  const produto = produtos.find((item) => item.id === paramsId);

  if (loading) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Carregando...</Text>
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Produto não encontrado.</Text>
      </View>
    );
  }

  const imagemSource = getImageSource(produto.imagens?.[0] ?? produto.imagem ?? produto.linkImagem, produto.id, produto.nome) ?? defaultAlbumImage;

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Image source={require("../assets/imagensMR/logo-midnight.png")} style={styles.logoImage} resizeMode="contain" />
          <View style={styles.backButtonPlaceholder} />
        </View>

              <View style={styles.artContainer}>
          <View style={styles.recordBackdrop} />
          <View style={styles.albumWrap}>
            <Image source={imagemSource} style={styles.albumImage} />
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.titleBlock}>
            <Text style={styles.productTitle}>{produto.nome}</Text>
            <Text style={styles.productArtist}>{produto.autor}</Text>
          </View>

          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>De</Text>
            <Text style={styles.priceOriginal}>{formatPrice(produto.precoCheio)}</Text>
            <Text style={styles.priceLabel}>Por</Text>
            <Text style={styles.priceDiscount}>{formatPrice(produto.precoDesconto ?? produto.precoCheio)}</Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Descrição</Text>
            <Text style={styles.description}>{produto.descricao}</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>Salvar produto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9}>
            <Text style={styles.secondaryButtonText}>Favoritar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0f2e",
  },
  fallbackText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
  background: {
    flex: 1,
    backgroundColor: "#1a0f2e",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 22,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212, 167, 79, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  backButtonText: {
    fontSize: 24,
    color: "#D4A74F",
    fontFamily: "Poppins_700Bold",
  },
  backButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  logoImage: {
    width: 180,
    height: 70,
  },
  artContainer: {
    alignItems: "center",
    marginBottom: 22,
  },
  recordBackdrop: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(212, 167, 79, 0.12)",
    top: 14,
  },
  albumWrap: {
    width: 220,
    height: 220,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#221F1A",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  albumImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsCard: {
    backgroundColor: "rgba(10, 15, 30, 0.92)",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(212, 167, 79, 0.24)",
    padding: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 12,
  },
  titleBlock: {
    marginBottom: 20,
  },
  productTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: "#ffffff",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  productArtist: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: "#CCF7E4",
    marginBottom: 0,
  },
  priceBlock: {
    marginBottom: 22,
  },
  priceLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#D4A74F",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  priceLabelSecondary: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#c3b9a3",
    marginTop: 14,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  priceOriginal: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#c3b9a3",
    textDecorationLine: "line-through",
    marginBottom: 12,
  },
  priceDiscount: {
    fontFamily: "Poppins_700Bold",
    fontSize: 34,
    color: "#ffffff",
    marginBottom: 4,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#D4A74F",
    marginBottom: 10,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#CCF7E4",
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: "#D4A74F",
    borderRadius: 28,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "rgba(212, 167, 79, 0.35)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontFamily: "Poppins_700Bold",
    color: "#1a0f2e",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  secondaryButton: {
    borderColor: "#D4A74F",
    borderWidth: 1,
    borderRadius: 28,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  secondaryButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#D4A74F",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
