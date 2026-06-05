import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { useRouter } from "expo-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useProdutosContext } from "../context/ProdutosContext";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";

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
  1: imagemSources["Disco1-1.png"],
  2: imagemSources["Disco2-1.png"],
  3: imagemSources["Disco3-1.png"],
  4: imagemSources["Disco4-1.png"],
};

const imagemFallbackByNome = {
  "The Queen Is Dead": imagemSources["Disco1-1.png"],
  "Super Real Me": imagemSources["Disco2-1.png"],
  "Ocean Blvd": imagemSources["Disco3-1.png"],
  GUTS: imagemSources["Disco4-1.png"],
};

const defaultAlbumImage = require("../assets/discos/Disco1-1.png");

export default function TelaHome() {
  const router = useRouter();
  const { produtos } = useProdutosContext();

  const [favoriteIds, setFavoriteIds] = React.useState([]);
  const [nomeUsuario, setNomeUsuario] = React.useState("");

  const carregarFavoritos = async () => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        setFavoriteIds([]);
        return;
      }

      const favoritosRef = collection(db, "favoritos", usuario.uid, "itens");
      const snapshot = await getDocs(favoritosRef);
      const ids = snapshot.docs.map((item) => item.id);

      setFavoriteIds(ids);
    } catch (error) {
      console.log("Erro ao carregar favoritos:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  const toggleFavorito = async (produto) => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        alert("Você precisa estar logado para favoritar.");
        return;
      }

      const produtoId = String(produto.id ?? produto.nome);
      const favoritoRef = doc(db, "favoritos", usuario.uid, "itens", produtoId);
      const jaFavoritado = favoriteIds.includes(produtoId);

      if (jaFavoritado) {
        await deleteDoc(favoritoRef);
        setFavoriteIds((current) => current.filter((id) => id !== produtoId));
      } else {
        await setDoc(favoritoRef, {
          id: produtoId,
          nome: produto.nome ?? "",
          preco: produto.precoDesconto || produto.preco || produto.precoCheio || "R$ 0,00",
          precoCheio: produto.precoCheio ?? "",
          precoDesconto: produto.precoDesconto ?? "",
          imagemKey: produto.id ?? produto.nome ?? "",
          imagem: typeof produto.imagem === "string" ? produto.imagem : "",
          linkImagem: typeof produto.linkImagem === "string" ? produto.linkImagem : "",
          descricao: produto.descricao ?? "",
          criadoEm: new Date().toISOString(),
        });

        setFavoriteIds((current) => [...current, produtoId]);
      }
    } catch (error) {
      console.log("Erro ao favoritar:", error);
      alert("Erro ao favoritar produto: " + error.message);
    }
  };

  const irParaDetalhes = (produtoId) => {
    const encodedId = encodeURIComponent(produtoId);
    router.push(`/detalhes?id=${encodedId}`);
  };

  React.useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const nomeSalvo = localStorage.getItem("nomeUsuario");

      if (nomeSalvo) {
        setNomeUsuario(nomeSalvo);
        return;
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setNomeUsuario(user.displayName);
        } else if (user.email) {
          setNomeUsuario(user.email.split("@")[0]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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

  const sanitizeImageName = (imagemNome) => {
    if (!imagemNome || typeof imagemNome !== "string") {
      return null;
    }

    const trimmed = imagemNome.trim();

    if (!trimmed) {
      return null;
    }

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:")
    ) {
      return { uri: trimmed };
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
    const imagemSource =
      getImageSource(
        produto.imagens?.[0] ?? produto.imagem ?? produto.linkImagem,
        produto.id,
        produto.nome
      ) ?? defaultAlbumImage;

    const precoBase = parsePrice(
      produto.precoCheio ?? produto.preco ?? produto.precoDesconto
    );

    const precoOriginal = precoBase;
    const precoDesconto = precoBase * 0.95;

    const produtoId = String(produto.id ?? produto.nome);
    const isFavorito = favoriteIds.includes(produtoId);

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
              <Text style={styles.precoOriginal}>
                {formatPrice(precoOriginal)}
              </Text>

              <Text style={styles.precoDesconto}>
                {formatPrice(precoDesconto)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.favoritoButton,
              isFavorito && styles.favoritoButtonActive,
            ]}
            onPress={() => toggleFavorito(produto)}
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
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/imagensMR/fundo-escuro.png")}
        style={StyleSheet.absoluteFillObject}
        imageStyle={styles.backgroundImage}
      />

      <FlatList
        style={styles.flatList}
        data={produtos}
        keyExtractor={(item, index) => String(item.id ?? item.nome ?? index)}
        renderItem={renderProduto}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <Image
                source={require("../assets/imagensMR/logo-com-fundo-novo.png")}
                style={styles.headerImage}
                resizeMode="cover"
              />

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={sairConta}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={14} color="#D4A74F" />
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
            </View>

            {nomeUsuario && (
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>
                  Olá,{" "}
                  <Text style={styles.userName}>
                    {nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1)}
                  </Text>
                  . Seja bem-vindo(a)!
                </Text>
              </View>
            )}

            <View style={styles.vitrineSection}>
              <Text style={styles.vitrineTitle}>VITRINE DE OFERTAS</Text>
            </View>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1a0f2e",
    overflow: "hidden",
  },

  backgroundImage: {
    resizeMode: "cover",
  },

  flatList: {
    flex: 1,
    backgroundColor: "transparent",
  },

  headerContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },

  headerImage: {
    width: "100%",
    height: "100%",
  },

  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(20, 15, 20, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(212, 167, 79, 0.4)",
  },

  logoutText: {
    fontFamily: "Poppins_500Medium",
    color: "#D4A74F",
    fontSize: 12,
    marginLeft: 6,
  },

  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#CCF7E4",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  userName: {
    fontFamily: "Poppins_600SemiBold",
    color: "#D4A74F",
  },

  vitrineSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
  },

  vitrineTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 32,
    color: "#CCF7E4",
    textAlign: "center",
    letterSpacing: 3,
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

  produtoImageAtual: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  cardContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  produtoNome: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
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
    paddingBottom: 110,
    paddingTop: 16,
  },
});