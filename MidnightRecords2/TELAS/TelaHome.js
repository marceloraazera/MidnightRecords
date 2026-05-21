import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";

export default function TelaInicio() {
  const produtos = [
    { id: 1, nome: "The Queen Is Dead", preco: "R$ 250,00", imagem: "🎵" },
    { id: 2, nome: "Super Real Me", preco: "R$ 250,00", imagem: "🎵" },
    { id: 3, nome: "Ocean Blvd", preco: "R$ 250,00", imagem: "🎵" },
    { id: 4, nome: "GUTS", preco: "R$ 250,00", imagem: "🎵" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerPlaceholder}>+</Text>
        <Text style={styles.logo}>MIDNIGHT</Text>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      {/* Novos Discos Section */}
      <View style={styles.novosDischttps}>
        <View style={styles.discContainer}>
          <Text style={styles.discImage}>💿</Text>
        </View>
        <View style={styles.discoTexto}>
          <Text style={styles.novosTitle}>NOVOS DISCOS</Text>
          <Text style={styles.novosSubtitle}>Chegaram raridades para a sua coleção.</Text>
        </View>
      </View>

      {/* Vitrine de Ofertas */}
      <View style={styles.vitrineSection}>
        <Text style={styles.vitrineTitle}>VITRINE DE OFERTAS</Text>
        
        <View style={styles.produtosGrid}>
          {produtos.map((produto) => (
            <View key={produto.id} style={styles.produtoCard}>
              <View style={styles.produtoImageContainer}>
                <Text style={styles.produtoImagePlaceholder}>{produto.imagem}</Text>
              </View>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              <View style={styles.produtoPreco}>
                <Text style={styles.preco}>{produto.preco}</Text>
                <TouchableOpacity>
                  <Text style={styles.coracao}>♡</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1a1420",
    marginTop: 12,
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

  // Novos Discos
  novosDischttps: {
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

  // Vitrine de Ofertas
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
  produtoNome: {
    fontSize: 13,
    color: "#ffffff",
    paddingHorizontal: 10,
    paddingTop: 12,
    fontWeight: "500",
  },
  produtoPreco: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  preco: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  coracao: {
    fontSize: 20,
    color: "#d4af37",
  },
});
