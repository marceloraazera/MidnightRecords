import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";

export default function TelaFavoritos() {
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

  const renderProduto = ({ item }) => {
    const imagem =
      item.linkImagem || item.imagem || "https://via.placeholder.com/300";

    return (
      <View style={styles.card}>
        <Image source={{ uri: imagem }} style={styles.image} />

        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.preco}>{item.preco || "R$ 0,00"}</Text>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => removerFavorito(item.id)}
        >
          <Feather name="heart" size={24} color="#D97B46" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos de {nome || "Usuário"}</Text>

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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1445",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    color: "#F1F6B3",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 24,
  },
  empty: {
    fontFamily: "Poppins_500Medium",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  list: {
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FFF3C9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 22,
    position: "relative",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  nome: {
    fontFamily: "Poppins_500Medium",
    color: "#111",
    fontSize: 13,
    marginTop: 10,
  },
  preco: {
    fontFamily: "Poppins_700Bold",
    color: "#111",
    fontSize: 16,
    marginTop: 2,
  },
  heartButton: {
    position: "absolute",
    right: 10,
    bottom: 12,
  },
});