import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useProdutosContext } from "../context/ProdutosContext";
import Feather from "@expo/vector-icons/Feather";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

// Mapeamentos sincronizados com TelaHome.js
const imagemFallbackById = {
  "the-queen-is-dead": imagemSources["Disco3-1.png"],
  "super-real-me": imagemSources["Disco1-1.png"],
  "ocean-blvd": imagemSources["Disco4-1.png"],
  guts: imagemSources["Disco2-1.png"],
  1: imagemSources["Disco3-1.png"],
  2: imagemSources["Disco1-1.png"],
  3: imagemSources["Disco4-1.png"],
  4: imagemSources["Disco2-1.png"],
};

const imagemFallbackByNome = {
  "The Queen Is Dead": imagemSources["Disco3-1.png"],
  "Super Real Me": imagemSources["Disco1-1.png"],
  "Ocean Blvd": imagemSources["Disco4-1.png"],
  GUTS: imagemSources["Disco2-1.png"],
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

const getFallbackDescription = (produtoId) => {
  const idStr = String(produtoId).toLowerCase();
  if (idStr === "1" || idStr === "the-queen-is-dead") {
    return "O ápice do indie rock britânico dos anos 80. Este álbum une a guitarra melódica de Johnny Marr às letras poéticas e sarcásticas de Morrissey, consolidando-se como uma obra-prima atemporal sobre a melancolia e a cultura inglesa.";
  }
  if (idStr === "2" || idStr === "super-real-me") {
    return "Um mergulho vibrante nas complexidades da vida moderna e do K-pop. ILLIT entrega faixas magnéticas e dançantes que exploram temas de autenticidade, auto-descobrimento e as pressões da juventude em um mundo hiperconectado.";
  }
  if (idStr === "3" || idStr === "ocean-blvd") {
    return "Lana Del Rey retorna com uma jornada íntima e cinematográfica. O álbum mistura melodias melancólicas, reflexões profundas sobre família e legado, e uma sonoridade nostálgica e atmosférica.";
  }
  if (idStr === "4" || idStr === "guts") {
    return "A evolução do pop punk com a voz marcante da Geração Z. Olivia Rodrigo transforma angústias adolescentes, relacionamentos confusos e as dores do amadurecimento em hinos poderosos e inesquecíveis.";
  }
  return "Um álbum incrível que não pode faltar na sua coleção. Adquira agora e desfrute de horas de boa música.";
};

export default function DetalhesProduto() {
  const router = useRouter();
  const rawParams = useLocalSearchParams();
  const paramsId = Array.isArray(rawParams.id) ? rawParams.id[0] : rawParams.id;
  const { produtos, loading } = useProdutosContext();

  const produto = produtos.find((item) => String(item.id) === String(paramsId));

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
        <TouchableOpacity
          style={styles.fallbackBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.fallbackBackText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imagemSource =
    getImageSource(
      produto.imagens?.[0] ?? produto.imagem ?? produto.linkImagem,
      produto.id,
      produto.nome
    ) ?? defaultAlbumImage;

  const precoBase = parsePrice(produto.precoCheio ?? produto.preco ?? produto.precoDesconto);
  const precoCheio = precoBase;
  const precoDesconto = precoBase * 0.95;

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.mainContainer}>
        {/* Conteúdo scrollável */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Midnight Records */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/imagensMR/logo-midnight.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Header: Voltar + Título */}
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={26} color="#D4A74F" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detalhes do Produto</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Imagem do álbum com efeito vinil */}
          <View style={styles.artSection}>
            <View style={styles.artWrapper}>
              {/* Disco de vinil atrás */}
              <View style={styles.vinylDisc}>
                <View style={styles.vinylOuter}>
                  <View style={styles.vinylMiddle}>
                    <View style={styles.vinylInner}>
                      <View style={styles.vinylCenter} />
                    </View>
                  </View>
                </View>
              </View>
              {/* Capa do álbum */}
              <View style={styles.albumCover}>
                <Image source={imagemSource} style={styles.albumImage} />
              </View>
            </View>
          </View>

          {/* Informações do produto */}
          <View style={styles.infoSection}>
            {/* Título do álbum */}
            <Text style={styles.albumTitle}>{produto.nome?.toUpperCase()}</Text>

            {/* Preço */}
            <View style={styles.priceSection}>
              <Text style={styles.priceOld}>
                De:{" "}
                <Text style={styles.priceOldValue}>
                  {formatPrice(precoCheio)}
                </Text>
              </Text>
              <Text style={styles.priceNew}>
                Por:{" "}
                <Text style={styles.priceNewValue}>
                  {formatPrice(precoDesconto)}
                </Text>
              </Text>
            </View>

            {/* Descrição */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Descrição</Text>
              <Text style={styles.descriptionText}>
                {produto.descricao || getFallbackDescription(produto.id)}
              </Text>
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>Salvar produto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.favButton}
              activeOpacity={0.85}
            >
              <Feather
                name="heart"
                size={18}
                color="#ffffff"
                style={styles.favIcon}
              />
              <Text style={styles.favButtonText}>Favoritar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Barra de navegação inferior fixa */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/(tabs)")}
          >
            <Feather name="home" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/(tabs)/add")}
          >
            <Feather name="plus-circle" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Criar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/(tabs)/favoritos")}
          >
            <Feather name="heart" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/(tabs)/perfil")}
          >
            <Feather name="user" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const ALBUM_SIZE = SCREEN_WIDTH * 0.48; // Reduzido para caber melhor na tela e futuramente no carrossel
const VINYL_SIZE = ALBUM_SIZE * 0.92;

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
  fallbackBackButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#D4A74F",
    borderRadius: 24,
  },
  fallbackBackText: {
    color: "#1a0f2e",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  background: {
    flex: 1,
    backgroundColor: "#1a0f2e",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* Logo */
  logoContainer: {
    alignItems: "center",
    paddingTop: 42,
    paddingBottom: 6,
  },
  logoImage: {
    width: 160,
    height: 60,
  },

  /* Header bar */
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(212, 167, 79, 0.16)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(212, 167, 79, 0.12)",
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 40,
  },

  /* Arte do álbum com vinil */
  artSection: {
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  artWrapper: {
    width: ALBUM_SIZE + VINYL_SIZE * 0.4,
    height: ALBUM_SIZE,
    position: "relative",
    alignItems: "flex-start",
  },
  vinylDisc: {
    position: "absolute",
    right: 0,
    top: (ALBUM_SIZE - VINYL_SIZE) / 2,
    width: VINYL_SIZE,
    height: VINYL_SIZE,
    borderRadius: VINYL_SIZE / 2,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  vinylOuter: {
    width: VINYL_SIZE * 0.88,
    height: VINYL_SIZE * 0.88,
    borderRadius: VINYL_SIZE * 0.44,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  vinylMiddle: {
    width: VINYL_SIZE * 0.5,
    height: VINYL_SIZE * 0.5,
    borderRadius: VINYL_SIZE * 0.25,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  vinylInner: {
    width: VINYL_SIZE * 0.3,
    height: VINYL_SIZE * 0.3,
    borderRadius: VINYL_SIZE * 0.15,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  vinylCenter: {
    width: VINYL_SIZE * 0.08,
    height: VINYL_SIZE * 0.08,
    borderRadius: VINYL_SIZE * 0.04,
    backgroundColor: "#555",
  },
  albumCover: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#221F1A",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    zIndex: 2,
  },
  albumImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  /* Informações */
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  albumTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#ffffff",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  priceSection: {
    marginBottom: 22,
  },
  priceOld: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#c3b9a3",
    marginBottom: 4,
    fontStyle: "italic",
  },
  priceOldValue: {
    textDecorationLine: "line-through",
    color: "#c3b9a3",
  },
  priceNew: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#D4A74F",
    fontStyle: "italic",
  },
  priceNewValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#ffffff",
    fontStyle: "normal",
  },

  /* Descrição */
  descriptionSection: {
    marginBottom: 10,
  },
  descriptionLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#D4A74F",
    marginBottom: 8,
    fontStyle: "italic",
  },
  descriptionText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#e0d6c8",
    lineHeight: 21,
  },

  /* Botões de ação */
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 14,
    marginBottom: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2d6a5c",
    borderRadius: 28,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  saveButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#ffffff",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  favButton: {
    flex: 1,
    backgroundColor: "#3d3341",
    borderRadius: 28,
    minHeight: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  favIcon: {
    marginRight: 8,
  },
  favButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#ffffff",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  /* Barra de navegação inferior */
  bottomNav: {
    flexDirection: "row",
    height: 72,
    backgroundColor: "#15101F",
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 167, 79, 0.25)",
    paddingTop: 8,
    paddingBottom: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#CCF7E4",
    marginTop: 4,
  },
});
