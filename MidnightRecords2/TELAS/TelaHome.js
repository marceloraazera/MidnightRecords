import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useProdutosContext } from "../context/ProdutosContext";

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

export default function TelaHome() {
  const router = useRouter();
  const { produtos } = useProdutosContext();

  const irParaAdmin = () => {
    router.push("/admin");
  };

  const getImageSource = (imagemNome) => {
    if (!imagemNome) {
      return null;
    }

    if (typeof imagemNome === "string") {
      const trimmed = imagemNome.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
        return { uri: trimmed };
      }

      return imagemSources[trimmed] ?? null;
    }

    return null;
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

  const renderProduto = ({ item: produto }) => {
    const imagemSource = getImageSource(
      produto.imagens?.[0] ?? produto.imagem ?? produto.linkImagem
    );
    const precoBase = parsePrice(produto.precoCheio ?? produto.preco ?? produto.precoDesconto);
    const precoOriginal = precoBase;
    const precoDesconto = precoBase * 0.95;

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoImageContainer}>
          {imagemSource ? (
            <Image source={imagemSource} style={styles.produtoImageAtual} />
          ) : (
            <Text style={styles.produtoImagePlaceholder}>💿</Text>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.produtoNome}>{produto.nome}</Text>
          <View style={styles.precoContainer}>
            <Text style={styles.precoOriginal}>{formatPrice(precoOriginal)}</Text>
            <Text style={styles.precoDesconto}>{formatPrice(precoDesconto)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.favoritoButton}>
          <Text style={styles.coracao}>♡</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
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
            <Text style={styles.logo}>MIDNIGHT</Text>
            <TouchableOpacity>
              <Text style={styles.headerIcon}>♡</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.novosDiscos}>
            <View style={styles.discContainer}>
              <Text style={styles.discImage}>💿</Text>
            </View>
            <View style={styles.discoTexto}>
              <Text style={styles.novosTitle}>NOVOS DISCOS</Text>
              <Text style={styles.novosSubtitle}>Chegaram raridades para a sua coleção.</Text>
            </View>
          </View>

          <View style={styles.vitrineSection}>
            <Text style={styles.vitrineTitle}>VITRINE DE OFERTAS</Text>
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a1f2f",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1a1420",
    marginTop: 12,
  },
  addButton: {
    padding: 8,
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
  headerIcon: {
    fontSize: 24,
    color: "#d4af37",
  },

  novosDiscos: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#1f4d3d",
    marginVertical: 16,
    alignItems: "center",
  },
  discContainer: {
    marginRight: 20,
  },
  discImage: {
    fontSize: 60,
  },
  discoTexto: {
    flex: 1,
  },
  novosTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d4af37",
    marginBottom: 4,
  },
  novosSubtitle: {
    fontSize: 13,
    color: "#a0d4b8",
    lineHeight: 18,
  },

  vitrineSection: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    backgroundColor: "#2a1f2f",
  },
  vitrineTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
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
    backgroundColor: "#3d3341",
    borderRadius: 8,
    overflow: "hidden",
  },
  produtoImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#4a4050",
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
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 16,
    padding: 6,
  },
  coracao: {
    fontSize: 18,
    color: "#d4af37",
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
