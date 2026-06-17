import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

const imagemSources = {
  "the-queen-is-dead": require("../assets/discos/Disco3-1.png"),
  "super-real-me": require("../assets/discos/Disco1-1.png"),
  "ocean-blvd": require("../assets/discos/Disco4-1.png"),
  "guts": require("../assets/discos/Disco2-1.png"),
  "The Queen Is Dead": require("../assets/discos/Disco3-1.png"),
  "Super Real Me": require("../assets/discos/Disco1-1.png"),
  "Ocean Blvd": require("../assets/discos/Disco4-1.png"),
  "GUTS": require("../assets/discos/Disco2-1.png"),
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

export default function TelaFavoritos() {
  const router = useRouter();

  const [favoritos, setFavoritos] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  const carregarFavoritos = async () => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        setFavoritos([]);
        return;
      }

      const favoritosRef = collection(db, "favoritos", usuario.uid, "itens");
      const snapshot = await getDocs(favoritosRef);

      const lista = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setFavoritos(lista);
    } catch (error) {
      console.log("Erro ao carregar favoritos:", error);
    }
  };

  const removerFavorito = async (produtoId) => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) return;

      await deleteDoc(doc(db, "favoritos", usuario.uid, "itens", produtoId));

      setFavoritos((current) =>
        current.filter((produto) => produto.id !== produtoId)
      );
    } catch (error) {
      console.log("Erro ao remover favorito:", error);
    }
  };

  const irParaDetalhes = (produtoId) => {
    const encodedId = encodeURIComponent(produtoId);
    router.push(`/detalhes?id=${encodedId}`);
  };

  const renderProduto = ({ item }) => {
  const imagem =
  item.linkImagem || item.imagem
    ? { uri: item.linkImagem || item.imagem }
    : imagemSources[item.imagemKey] || imagemSources[item.id] || imagemSources[item.nome];

  const precoBase = parsePrice(item.precoCheio ?? item.preco ?? item.precoDesconto);
  const precoDesconto = precoBase * 0.95;
  const precoBaseFormatado = formatPrice(precoBase);
  const precoDescontoFormatado = formatPrice(precoDesconto);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => irParaDetalhes(item.id)}
      >
        <View style={styles.imageContainer}>
          <Image source={imagem} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.nome} numberOfLines={1}>
            {item.nome}
          </Text>

          {precoBase > 0 ? (
            <View style={styles.priceBox}>
              <Text style={styles.precoOriginal} numberOfLines={1}>De {precoBaseFormatado}</Text>
              <Text style={styles.precoAtual} numberOfLines={1}>Por {precoDescontoFormatado}</Text>
            </View>
          ) : (
            <Text style={styles.preco}>{formatPrice(0)}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => removerFavorito(item.id)}
        >
          <View style={styles.heartButtonInner}>
            <Ionicons name="heart" size={22} color="#D97B46" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
  source={require("../assets/imagensMR/fundo-claro.png")}
  style={styles.background}
  imageStyle={styles.backgroundImage}
>
        <View style={styles.logoContainer}>
        <Image
          source={require("../assets/imagensMR/logo-completa-midnight.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        </View>

      <View style={styles.titleBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#D97B46" />
        </TouchableOpacity>

        <Text style={styles.title}>Favoritados</Text>

        <View style={{ width: 40 }} />
      </View>

      {favoritos.length === 0 ? (
        <Text style={styles.empty}>Nenhum produto favoritado ainda.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 4,
  },
  logo: {
    width: 168,
    height: 78,
  },
  titleBar: {
    height: 48,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(217, 123, 70, 0.28)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    color: "#D97B46",
    fontSize: 18,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  empty: {
    fontFamily: "Poppins_500Medium",
    color: "#1a0f2e",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "47%",
    backgroundColor: "#FFF4C8",
    borderRadius: 22,
    overflow: "hidden",
    paddingBottom: 14,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(217, 123, 70, 0.18)",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FFF4C8",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  nome: {
    fontFamily: "Poppins_600SemiBold",
    color: "#111",
    fontSize: 13,
    lineHeight: 16,
  },
  priceBox: {
    marginTop: 6,
  },
  precoOriginal: {
    fontFamily: "Poppins_400Regular",
    color: "#6b6b6b",
    fontSize: 12,
    lineHeight: 15,
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  precoAtual: {
    fontFamily: "Poppins_700Bold",
    color: "#111",
    fontSize: 16,
    lineHeight: 19,
  },
  preco: {
    fontFamily: "Poppins_700Bold",
    color: "#111",
    fontSize: 16,
    lineHeight: 19,
    marginTop: 6,
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  heartButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(217, 123, 70, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(217, 123, 70, 0.28)",
    justifyContent: "center",
    alignItems: "center",
  },
});
