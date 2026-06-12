import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useProdutosContext } from "../context/ProdutosContext";
import { auth } from "../config/firebaseConfig";
import Feather from "@expo/vector-icons/Feather";
import { useCart } from "../context/CartContext";

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

const imagemFallbackById = {
  "the-queen-is-dead": imagemSources["Disco3-1.png"],
  "super-real-me": imagemSources["Disco1-1.png"],
  "ocean-blvd": imagemSources["Disco4-1.png"],
  guts: imagemSources["Disco2-1.png"],
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

const getImagesArray = (produtoId, produtoNome, defaultSource) => {
  const idStr = String(produtoId).toLowerCase();
  
  if (idStr === "the-queen-is-dead" || produtoNome === "The Queen Is Dead") {
    return [imagemSources["Disco3-1.png"], imagemSources["Disco3-2.png"], imagemSources["Disco3-3.png"]];
  }
  if (idStr === "super-real-me" || produtoNome === "Super Real Me") {
    return [imagemSources["Disco1-1.png"], imagemSources["Disco1-2.png"], imagemSources["Disco1-3.png"]];
  }
  if (idStr === "ocean-blvd" || produtoNome === "Ocean Blvd") {
    return [imagemSources["Disco4-1.png"], imagemSources["Disco4-2.png"], imagemSources["Disco4-3.png"]];
  }
  if (idStr === "guts" || produtoNome === "GUTS") {
    return [imagemSources["Disco2-1.png"], imagemSources["Disco2-2.png"], imagemSources["Disco2-3.png"]];
  }
  
  return [defaultSource];
};

const parsePrice = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
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
  if (idStr === "the-queen-is-dead") {
    return "O ápice do indie rock britânico dos anos 80. Este álbum une a guitarra melódica de Johnny Marr às letras poéticas e sarcásticas de Morrissey, consolidando-se como uma obra-prima atemporal sobre a melancolia e a cultura inglesa.";
  }
  if (idStr === "super-real-me") {
    return "Um mergulho vibrante nas complexidades da vida moderna e do K-pop. ILLIT entrega faixas magnéticas e dançantes que exploram temas de autenticidade, auto-descobrimento e as pressões da juventude em um mundo hiperconectado.";
  }
  if (idStr === "ocean-blvd") {
    return "Lana Del Rey retorna com uma jornada íntima e cinematográfica. O álbum mistura melodias melancólicas, reflexões profundas sobre família e legado, e uma sonoridade nostálgica e atmosférica.";
  }
  if (idStr === "guts") {
    return "A evolução do pop punk com a voz marcante da Geração Z. Olivia Rodrigo transforma angústias adolescentes, relacionamentos confusos e as dores do amadurecimento em hinos poderosos e inesquecíveis.";
  }
  return "Um álbum incrível que não pode faltar na sua coleção. Adquira agora e desfrute de horas de boa música.";
};

export default function DetalhesProduto() {
  const router = useRouter();
  const rawParams = useLocalSearchParams();
  const paramsId = Array.isArray(rawParams.id) ? rawParams.id[0] : rawParams.id;
  const { produtos, loading, deletarProduto } = useProdutosContext();
  
  // Controle do scroll do carrossel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const produto = produtos.find((item) => String(item.id) === String(paramsId));

  const produtosRelacionados = React.useMemo(() => {
    return produtos
      .filter((item) => String(item.id) !== String(paramsId))
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        if (produto?.categoria && a.categoria === produto.categoria) scoreA++;
        if (produto?.categoria && b.categoria === produto.categoria) scoreB++;
        if (produto?.artista && a.artista === produto.artista) scoreA++;
        if (produto?.artista && b.artista === produto.artista) scoreB++;
        
        if (scoreA !== scoreB) return scoreB - scoreA;
        return 0.5 - Math.random();
      })
      .slice(0, 6);
  }, [produtos, paramsId, produto]);

  const { addItem } = useCart();

  // Permite excluir se: 1) usuario está logado, 2) produto tem criadoPor definido, 3) é o criador
  const podeExcluir = auth.currentUser && produto?.criadoPor && produto?.criadoPor === auth.currentUser.uid;

  console.log("=== DEBUG DETALHES ===");
  console.log("Produto encontrado:", produto?.id, produto?.nome);
  console.log("Usuário logado:", auth.currentUser?.uid, auth.currentUser?.email);
  console.log("criadoPor:", produto?.criadoPor);
  console.log("podeExcluir?", podeExcluir);
  console.log("Botão de lixeira será renderizado?", podeExcluir);

  const primarySource = produto ? getImageSource(
    produto.imagens?.[0] ?? produto.imagem ?? produto.linkImagem,
    produto.id,
    produto.nome
  ) ?? defaultAlbumImage : defaultAlbumImage;

  const precoBase = parsePrice(produto?.precoCheio ?? produto?.preco ?? produto?.precoDesconto);
  const precoDesconto = precoBase * 0.95;

  const handleAddToCart = () => {
    if (!produto) return;
    addItem({
      id: produto.id,
      nome: produto.nome,
      preco: precoDesconto,
      imagem: primarySource,
    });
    Alert.alert("Sucesso", "Produto adicionado ao carrinho!");
  };

  const excluirProduto = async () => {
    try {
      console.log("🗑️ INICIANDO EXCLUSÃO!");
      console.log("isDeleting antes:", isDeleting);
      setIsDeleting(true);
      
      const produtoId = produto?.id ?? paramsId;
      console.log("ID a deletar:", produtoId);
      console.log("Chamando deletarProduto...");
      
      await deletarProduto(produtoId);
      
      console.log("✅ Produto excluído com sucesso!");
      Alert.alert(
        "Sucesso",
        "Disco excluído com sucesso!",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (error) {
      console.error("❌ Erro ao excluir produto:", error.message || error);
      
      let mensagemErro = "Não foi possível excluir este disco.";
      
      if (error.message) {
        if (error.message.includes("permissão") || error.message.includes("criador")) {
          mensagemErro = "Você não tem permissão para excluir este disco. Apenas o criador pode deletá-lo.";
        } else if (error.message.includes("não encontrado")) {
          mensagemErro = "Disco não encontrado.";
        } else {
          mensagemErro = error.message;
        }
      }
      
      Alert.alert("Erro", mensagemErro);
    } finally {
      setIsDeleting(false);
      console.log("isDeleting depois:", false);
    }
  };

  const confirmarExclusao = () => {
    console.log("✨ Função confirmarExclusao foi chamada!");
    console.log("isDeleting:", isDeleting);
    console.log("podeExcluir:", podeExcluir);
    
    if (isDeleting) {
      console.warn("Já está deletando, ignorando novo clique");
      return; // Evitar múltiplos cliques
    }
    
    Alert.alert(
      "Excluir disco",
      "Tem certeza que deseja excluir este disco? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: excluirProduto,
        },
      ]
    );
  };

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

  const carouselImages = produto.imagens && produto.imagens.length > 1 
                         ? produto.imagens.map(img => getImageSource(img, produto.id, produto.nome) ?? primarySource)
                         : getImagesArray(produto.id, produto.nome, primarySource);

  const precoCheio = precoBase;

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index !== currentImageIndex) {
      setCurrentImageIndex(index);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/imagensMR/fundo-escuro.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.mainContainer}>
        {/* Conteúdo principal da tela com scroll */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {/* Logo Midnight Records Reduzida */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/imagensMR/logo-midnight.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Header Bar */}
          <View style={styles.headerBox}>
            <View style={styles.headerBar}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Feather name="chevron-left" size={24} color="#D4A74F" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Detalhes do Produto</Text>
              <View style={styles.headerPlaceholder} />
            </View>
            <View style={styles.headerDivider} />
          </View>

          {/* Imagem do álbum (Carrossel) */}
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              bounces={false}
              overScrollMode="never"
            >
              {carouselImages.map((imgSrc, index) => (
                <View key={index} style={styles.carouselItem}>
                  <View style={styles.artWrapper}>
                    {/* Disco de vinil atrás SOMENTE na primeira imagem */}
                    {index === 0 && (
                      <View style={styles.vinylDisc}>
                        <View style={styles.vinylOuter}>
                          <View style={styles.vinylMiddle}>
                            <View style={styles.vinylInner}>
                              <View style={styles.vinylCenter} />
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                    
                    {/* Capa do álbum */}
                    <View style={styles.albumCover}>
                      <Image source={imgSrc} style={styles.albumImage} resizeMode="cover" />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            {/* Indicadores do carrossel (dots) */}
            {carouselImages.length > 1 && (
              <View style={styles.paginationDots}>
                {carouselImages.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.dot, 
                      index === currentImageIndex ? styles.activeDot : styles.inactiveDot
                    ]} 
                  />
                ))}
              </View>
            )}
          </View>

          {/* Informações do produto */}
          <View style={styles.infoSection}>
            <Text style={styles.albumTitle}>{produto.nome?.toUpperCase()}</Text>

            <View style={styles.priceSection}>
              <Text style={styles.priceOld}>
                De: <Text style={styles.priceOldValue}>{formatPrice(precoCheio)}</Text>
              </Text>
              <Text style={styles.priceNew}>
                Por: <Text style={styles.priceNewValue}>{formatPrice(precoDesconto)}</Text>
              </Text>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Descrição</Text>
              <Text style={styles.descriptionText}>
                {produto.descricao || getFallbackDescription(produto.id)}
              </Text>
            </View>
          </View>

          {/* Botões de ação lado a lado */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleAddToCart}>
              <Text style={styles.saveButtonText}>Salvar produto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.favButton} activeOpacity={0.85}>
              <Feather name="heart" size={18} color="#ffffff" style={styles.favIcon} />
              <Text style={styles.favButtonText}>Favoritar</Text>
            </TouchableOpacity>

            {podeExcluir && (
              <View style={styles.deleteButtonWrapper}>
                <TouchableOpacity
                  style={[styles.deleteButton, isDeleting && { opacity: 0.6 }]}
                  onPress={confirmarExclusao}
                  activeOpacity={0.85}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator color="#ff4d4d" size="small" />
                  ) : (
                    <Feather name="trash-2" size={20} color="#ff4d4d" />
                  )}
                </TouchableOpacity>
              </View>
            )}

            {!podeExcluir && produto?.criadoPor && (
              <View style={styles.deleteButtonWrapper}>
                <TouchableOpacity
                  style={[styles.deleteButton, { opacity: 0.5 }]}
                  disabled
                  activeOpacity={0.85}
                >
                  <Text style={styles.deleteButtonText}>Só o criador pode excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Seção Veja também */}
          {produtosRelacionados.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Veja também</Text>
              <Text style={styles.relatedSubtitle}>Outros discos que podem te interessar</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedScrollContent}
              >
                {produtosRelacionados.map((item) => {
                  const itemImg = getImageSource(
                    item.imagens?.[0] ?? item.imagem ?? item.linkImagem, 
                    item.id, 
                    item.nome
                  ) ?? defaultAlbumImage;
                  const itemPreco = parsePrice(item.precoCheio ?? item.preco ?? item.precoDesconto);
                  
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={styles.relatedCard}
                      onPress={() => router.push({ pathname: "/detalhes", params: { id: item.id } })}
                      activeOpacity={0.85}
                    >
                      <Image source={itemImg} style={styles.relatedImage} resizeMode="cover" />
                      <Text style={styles.relatedName} numberOfLines={1}>{item.nome}</Text>
                      <Text style={styles.relatedPrice}>{formatPrice(itemPreco)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* Barra de navegação inferior fixa */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/(tabs)")}>
            <Feather name="home" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/(tabs)/add")}>
            <Feather name="plus-circle" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Criar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/(tabs)/favoritos")}>
            <Feather name="heart" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/(tabs)/perfil")}>
            <Feather name="user" size={24} color="#CCF7E4" />
            <Text style={styles.navLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// Proporções atualizadas para o carrossel
const ALBUM_SIZE = SCREEN_WIDTH * 0.60; // Imagem maior para destaque premium
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
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Garante que role acima do bottom nav
  },

  /* Logo */
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  logoImage: {
    height: 40,
  },

  /* Header bar escuro (como na imagem) */
  headerBox: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 16,
    marginBottom: 4,  
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(212, 167, 79, 0.15)",
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 36,
  },

  /* Carrossel e Arte */
  carouselContainer: {
    marginBottom: 16,
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  artWrapper: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  vinylDisc: {
    position: "absolute",
    right: -VINYL_SIZE * 0.4,
    top: (ALBUM_SIZE - VINYL_SIZE) / 2,
    width: VINYL_SIZE,
    height: VINYL_SIZE,
    borderRadius: VINYL_SIZE / 2,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  vinylOuter: {
    width: VINYL_SIZE * 0.88,
    height: VINYL_SIZE * 0.88,
    borderRadius: VINYL_SIZE * 0.44,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  vinylMiddle: {
    width: VINYL_SIZE * 0.5,
    height: VINYL_SIZE * 0.5,
    borderRadius: VINYL_SIZE * 0.25,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  vinylInner: {
    width: VINYL_SIZE * 0.3,
    height: VINYL_SIZE * 0.3,
    borderRadius: VINYL_SIZE * 0.15,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  vinylCenter: {
    width: VINYL_SIZE * 0.08,
    height: VINYL_SIZE * 0.08,
    borderRadius: VINYL_SIZE * 0.04,
    backgroundColor: "#444",
  },
  albumCover: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    borderRadius: 10,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  albumImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#D4A74F",
    width: 16,
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  /* Informações */
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  albumTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#CCF7E4",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  priceOld: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#999080",
    fontStyle: "italic",
  },
  priceOldValue: {
    textDecorationLine: "line-through",
    color: "#999080",
  },
  priceNew: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#D4A74F",
    fontStyle: "italic",
  },
  priceNewValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#CCF7E4",
    fontStyle: "normal",
  },

  /* Descrição */
  descriptionSection: {
    marginBottom: 4,
  },
  descriptionLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#D4A74F",
    marginBottom: 4,
    fontStyle: "italic",
  },
  descriptionText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#f0f0f0",
    lineHeight: 20,
    paddingRight: 0,
  },

  /* Botões de ação */
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 12,
    marginBottom: 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#CA743C", 
    borderRadius: 24,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  saveButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#ffffff",
    fontSize: 14,
  },
  favButton: {
    flex: 1,
    backgroundColor: "#1C5544",
    borderRadius: 24,
    minHeight: 44,
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
  },
  cartButton: {
    flex: 1,
    backgroundColor: "#D4A74F",
    borderRadius: 24,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginHorizontal: 4,
  },
  cartButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#15101F",
    fontSize: 14,
  },
  trashIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.3)",
  },

  /* Veja também */
  relatedSection: {
    marginTop: 10,
    marginBottom: 40,
  },
  relatedTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#CCF7E4",
    paddingHorizontal: 24,
    marginBottom: 2,
  },
  relatedSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#999080",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  relatedScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  relatedCard: {
    width: 120,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  relatedImage: {
    width: "100%",
    height: 104,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#ffffff",
    marginBottom: 4,
  },
  relatedPrice: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
    color: "#D4A74F",
  },

  /* Barra de navegação inferior */
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    height: 72,
    backgroundColor: "#15101F",
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 167, 79, 0.25)",
    paddingTop: 8,
    paddingBottom: 10,
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 10,
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
