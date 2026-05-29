import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useProdutosContext } from "../context/ProdutosContext";
import Feather from '@expo/vector-icons/Feather';

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
  "guts": imagemSources["Disco4-1.png"],
};

const defaultAlbumImage = require("../assets/discos/Disco1-1.png");

export default function TelaHome() {
  const router = useRouter();
  const { produtos } = useProdutosContext();
  const [favoriteIds, setFavoriteIds] = React.useState([]);
  const [nomeUsuario, setNomeUsuario] = React.useState("");

  const toggleFavorito = (id) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const irParaDetalhes = (produtoId) => {
    const encodedId = encodeURIComponent(produtoId);
    router.push(`/detalhes?id=${encodedId}`);
  };

  React.useEffect(() => {
    const recuperarNome = async () => {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const nome = localStorage.getItem("nomeUsuario");
        if (nome) {
          setNomeUsuario(nome);
        }
      }
    };
    recuperarNome();
  }, []);

  const sairConta = async () => {
    try {
      await signOut(auth);
      if (Platform.OS === "web" && typeof window !== "undefined") {
        localStorage.removeItem("nomeUsuario");
      }
      router.replace("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
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

    const fileName = trimmed.replace(/^.*[\/]/, "").replace(/\s*-\s*/g, "-");
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
    const imagemSource = getImageSource(
      produto.imagens?.[0] ?? produto.imagem ?? produto.linkImagem,
      produto.id
    ) ?? defaultAlbumImage;
    const precoBase = parsePrice(produto.precoCheio ?? produto.preco ?? produto.precoDesconto);
    const precoOriginal = precoBase;
    const precoDesconto = precoBase * 0.95;
    const isFavorito = favoriteIds.includes(produto.id);

    return (
      <TouchableOpacity
        style={styles.produtoCardButton}
        activeOpacity={0.92}
        onPress={() => irParaDetalhes(produto.id)}
      >
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
          <TouchableOpacity
            style={[styles.favoritoButton, isFavorito && styles.favoritoButtonActive]}
            onPress={() => toggleFavorito(produto.id)}
          >
            <Feather
              name="heart"
              size={20}
              color={isFavorito ? "#FFA500" : "#ffffff"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.background}
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
              <Image 
                source={require("../assets/imagensMR/logo-midnight.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.logoutButton} onPress={sairConta} activeOpacity={0.8}>
                <Feather name="log-out" size={18} color="#D4A74F" />
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
            </View>

            {nomeUsuario && (
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>
                  Olá, <Text style={styles.userName}>{nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1)}</Text>
                </Text>
              </View>
            )}

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
    backgroundColor: "transparent",
  },
  
  background: {
    flex: 1,
    backgroundColor: "#1a0f2e",
  },
  backgroundImage: {
    resizeMode: "cover",
  },

  flatList: {
    flex: 1,
    backgroundColor: "transparent",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    padding: 14,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(212, 167, 79, 0.16)",
  },
  logoImage: {
    height: 72,
    width: 180,
    maxWidth: 180,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: "rgba(212, 167, 79, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(212, 167, 79, 0.3)",
    minWidth: 72,
    maxWidth: 100,
  },
  logoutText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#D4A74F",
    fontSize: 12,
    marginLeft: 4,
  },
  
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 18,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  welcomeText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: "#CCF7E4",
    fontWeight: "600",
    letterSpacing: 1.2,
    textAlign: "left",
  },
  userName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#D4A74F",
    fontWeight: "800",
    letterSpacing: 2,
  },
  
  discoTexto: {
    flex: 1,
  },
 

  bannerImage: {
    width: "100%",
    height: 210,
    marginBottom: 16,
  },

  vitrineSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  vitrineTitle: {
    fontFamily: "Poppins_600SemiBold",
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
  produtoCardButton: {
    width: "48%",
    marginBottom: 20,
  },
  produtoCard: {
    width: "100%",
    backgroundColor: "#221F1A",
    borderRadius: 22,
    overflow: "hidden",
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  produtoImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#221F1A",
    justifyContent: "center",
    alignItems: "center",
  },
  produtoImagePlaceholder: {
    fontFamily: "Poppins_700Bold",
    fontSize: 50,
  },
  produtoImageAtual: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },
  produtoNome: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 10,
  },
  precoContainer: {
    flexDirection: "column",
  },
  precoOriginal: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#c3b9a3",
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  precoDesconto: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    fontWeight: "bold",
    color: "#d4af37",
  },
  favoritoButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.36)",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  favoritoButtonActive: {
    backgroundColor: "rgba(255, 165, 0, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.8)",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingBottom: 36,
    paddingTop: 16,
  },
});
