import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { useProdutosContext } from "../context/ProdutosContext";
import Feather from '@expo/vector-icons/Feather';

const imagemSources = {
  "Disco1 - 1.png": require("../assets/discos/Disco1 - 1.png"),
  "Disco1 - 2.png": require("../assets/discos/Disco1 - 2.png"),
  "Disco1 - 3.png": require("../assets/discos/Disco1 - 3.png"),
  "Disco2 - 1.png": require("../assets/discos/Disco2 - 1.png"),
  "Disco2 - 2.png": require("../assets/discos/Disco2 - 2.png"),
  "Disco2 - 3.png": require("../assets/discos/Disco2 - 3.png"),
  "Disco3 - 1.png": require("../assets/discos/Disco3 - 1.png"),
  "Disco3 - 2.png": require("../assets/discos/Disco3 - 2.png"),
  "Disco3 - 3.png": require("../assets/discos/Disco3 - 3.png"),
  "Disco4 - 1.png": require("../assets/discos/Disco4 - 1.png"),
  "Disco4 - 2.png": require("../assets/discos/Disco4 - 2.png"),
  "Disco4 - 3.png": require("../assets/discos/Disco4 - 3.png"),
};

const imagemFallbackById = {
  "the-queen-is-dead": imagemSources["Disco1 - 1.png"],
  "super-real-me": imagemSources["Disco2 - 1.png"],
  "ocean-blvd": imagemSources["Disco3 - 1.png"],
  "guts": imagemSources["Disco4 - 1.png"],
};

const defaultAlbumImage = require("../assets/discos/Disco1 - 1.png");
const positionAlbumImages = {
  0: imagemSources["Disco3 - 1.png"],
  1: imagemSources["Disco1 - 1.png"],
  2: imagemSources["Disco4 - 1.png"],
  3: imagemSources["Disco2 - 1.png"],
};

export default function TelaHome() {
  const router = useRouter();
  const { produtos } = useProdutosContext();

  const irParaAdmin = () => {
    router.push("/admin");
  };

  const sanitizeImageName = (imagemNome) => {
    if (!imagemNome || typeof imagemNome !== "string") {
      return null;
    }

    const trimmed = imagemNome.trim();
    if (!trimmed) {
      return null;
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
      return { uri: trimmed };
    }

    const fileName = trimmed.replace(/^.*[\\/]/, "");
    return imagemSources[fileName] ?? imagemSources[fileName.toLowerCase()] ?? null;
  };

  const getImageSource = (imagemNome, produtoId) => {
    const fonte = sanitizeImageName(imagemNome);
    if (fonte) {
      return fonte;
    }
    return imagemFallbackById[produtoId] ?? null;
  };

  const parsePrice = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.replace(/[^0-9,.-]/g, "").replace(/,/g, ".");
      const parsed = parseFloat(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const formatPrice = (value) => {
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
  };

  const renderProduto = ({ item: produto, index }) => {
    const imagemSource = positionAlbumImages[index] ?? getImageSource(
      produto.imagens?.[0] ?? produto.imagem ?? produto.linkImagem,
      produto.id
    ) ?? defaultAlbumImage;
    const precoBase = parsePrice(produto.precoCheio ?? produto.preco ?? produto.precoDesconto);
    const precoOriginal = precoBase;
    const precoDesconto = precoBase * 0.95;

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoImageContainer}>
          <Image source={imagemSource} style={styles.produtoImageAtual} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.produtoNome}>{produto.nome}</Text>
          <View style={styles.precoContainer}>
            <Text style={styles.precoOriginal}>{formatPrice(precoOriginal)}</Text>
            <Text style={styles.precoDesconto}>{formatPrice(precoDesconto)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.favoritoButton}>
          <Text style={styles.coracao}><Feather name="heart" size={18} color="white" /></Text>
        </TouchableOpacity>
      </View>
      
    );
  };

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <FlatList
        style={styles.flatList}
        data={produtos}
        keyExtractor={(item, index) => String(item.id ?? item.nome ?? index)}
        renderItem={renderProduto}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={irParaAdmin} style={styles.addButton}>
                <Text style={styles.headerPlaceholder}>+</Text>
              </TouchableOpacity>
              <Image 
                source={require("../assets/imagensMR/logo-midnight.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <TouchableOpacity>
                <Text style={styles.headerIcon}>♡</Text>
              </TouchableOpacity>
            </View>

            <Image 
              source={require("../assets/imagensMR/banner.png")}
              style={styles.bannerImage}
              resizeMode="cover"
            />

            <View style={styles.vitrineSection}>
              <Text style={styles.vitrineTitle}>VITRINE DE OFERTAS</Text>
            </View>
          </>
        }
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a1f2f",
  },

  flatList: {
    flex: 1,
    backgroundColor: "transparent",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
 
  headerPlaceholder: {
    fontSize: 32,
    color: "#d4af37",
    fontWeight: "bold",
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d4af37",
    letterSpacing: 2,
  },
  logoImage: {
    height: 130,
    width: 300,
  },
  headerIcon: {
    fontSize: 24,
    color: "#d4af37",
  },
  
  discoTexto: {
    flex: 1,
  },
 

  bannerImage: {
    width: "100%",
    height: 200,  
  },

  vitrineSection: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    
  },
  vitrineTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#CCF7E4",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  produtosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  produtoCard: {
    width: "48%",
    marginBottom: 20,
    backgroundColor: "#221F1A",
    borderRadius: 8,
    overflow: "hidden",
  },
  produtoImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#221F1A",
    justifyContent: "center",
    alignItems: "center",
  },
  produtoImagePlaceholder: {
    fontSize: 50,
  },
  produtoImageAtual: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 10,
  },
  produtoNome: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 8,
  },
  precoContainer: {
    flexDirection: "column",
  },
  precoOriginal: {
    fontSize: 12,
    color: "#c3b9a3",
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  precoDesconto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d4af37",
  },
  favoritoButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.36)",
    borderRadius: '100%',
    padding: 6,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  flatListContent: {
    paddingBottom: 32,
    paddingTop: 12,
  },
});
