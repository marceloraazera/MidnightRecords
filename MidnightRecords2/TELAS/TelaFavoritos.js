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
  const [nome, setNome] = useState("");

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
        setNome("Usuário");
        return;
      }

      setNome(usuario.displayName || "Usuário");

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
        <Image source={imagem} style={styles.image} resizeMode="cover" />

        <Text style={styles.nome} numberOfLines={2}>
          {item.nome}
        </Text>

        {precoBase > 0 ? (
          <View style={styles.priceBox}>
            <Text style={styles.precoOriginal}>De {precoBaseFormatado}</Text>
            <Text style={styles.precoAtual}>Por {precoDescontoFormatado}</Text>
          </View>
        ) : (
          <Text style={styles.preco}>{formatPrice(0)}</Text>
        )}

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => removerFavorito(item.id)}
        >
          <Ionicons name="heart" size={30} color="#D97B46" />
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
  header: {
    height: 102,
    paddingHorizontal: 26,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(217, 123, 70, 0.32)",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 120,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBar: {
    height: 42,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(217, 123, 70, 0.28)",
  },
  backButton: {
    width: 40,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#D97B46",
    fontSize: 17,
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
    paddingHorizontal: 34,
    paddingTop: 16,
    paddingBottom: 110,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
  width: "46.5%",
  backgroundColor: "#FFF4C8",
  borderRadius: 8,
  padding: 12,
  marginBottom: 22,
  minHeight: 210,
  maxHeight: 210,
  position: "relative",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
},

image: {
  width: "100%",
  height: 112,
  borderRadius: 7,
  backgroundColor: "#D9D9D9",
  resizeMode: "cover",
},
  nome: {
    fontFamily: "Poppins_500Medium",
    color: "#111",
    fontSize: 12,
    lineHeight: 13,
    marginTop: 8,
    paddingRight: 28,
  },
  priceBox: {
    marginTop: 8,
  },
  precoOriginal: {
    fontFamily: "Poppins_400Regular",
    color: "#6b6b6b",
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  precoAtual: {
    fontFamily: "Poppins_700Bold",
    color: "#111",
    fontSize: 15,
    marginTop: 2,
  },
  preco: {
    fontFamily: "Poppins_700Bold",
    color: "#111",
    fontSize: 15,
    marginTop: 2,
    paddingRight: 28,
  },
  heartButton: {
  position: "absolute",
  right: 10,
  bottom: 18,
},
});