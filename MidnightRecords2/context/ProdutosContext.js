import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

const PRODUTOS_STORAGE_KEY = "@midnight_produtos";

const ProdutosContext = createContext();

export function ProdutosProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const produtosPadrao = [
    {
      id: "the-queen-is-dead",
      nome: "The Queen Is Dead",
      autor: "The Smiths",
      descricao: "Álbum clássico do rock alternativo britânico com letras melancólicas e instrumentais marcantes. Uma das obras mais icônicas dos anos 80.",
      precoCheio: 299.9,
      precoDesconto: 250.0,
      imagens: ["Disco3 - 1.png", "Disco3 - 2.png", "Disco3 - 3.png"],
    },
    {
      id: "super-real-me",
      nome: "Super Real Me",
      autor: "ILLIT",
      descricao: "Mini álbum moderno do k-pop com sonoridade leve, energética e estética jovem. Mistura pop eletrônico com refrões viciantes.",
      precoCheio: 299.9,
      precoDesconto: 250.0,
      imagens: ["Disco1 - 1.png", "Disco1 - 2.png", "Disco1 - 3.png"],
    },
    {
      id: "ocean-blvd",
      nome: "Ocean Blvd",
      autor: "Lana Del Rey",
      descricao: "Projeto introspectivo e cinematográfico com vocais suaves e produção emocional. Um dos trabalhos mais profundos da cantora.",
      precoCheio: 299.9,
      precoDesconto: 250.0,
      imagens: ["Disco4 - 1.png", "Disco4 - 2.png", "Disco4 - 3.png"],
    },
    {
      id: "guts",
      nome: "GUTS",
      autor: "Olivia Rodrigo",
      descricao: "Álbum intenso e autêntico que mistura pop rock, emoções adolescentes e letras marcantes. Repleto de faixas explosivas e sentimentais.",
      precoCheio: 299.9,
      precoDesconto: 290.0,
      imagens: ["Disco2- 1.png", "Disco2 - 2.png", "Disco2 - 3.png"],
    },
  ];

  const mergeWithDefaults = (remoteProducts) => {
    const defaultIds = new Set(remoteProducts.map((item) => String(item.id)));
    return [
      ...produtosPadrao.filter((item) => !defaultIds.has(String(item.id))),
      ...remoteProducts,
    ];
  };

  useEffect(() => {
    const carregarProdutosLocal = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(PRODUTOS_STORAGE_KEY);
        if (jsonValue) {
          setProdutos(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error("Erro ao carregar produtos locais:", error);
      }
    };

    carregarProdutosLocal();

    const produtosRef = collection(db, "produtos");
    const produtosQuery = query(produtosRef);

    const unsubscribe = onSnapshot(
      produtosQuery,
      async (snapshot) => {
        const produtosRemotos = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        const produtosCompletos = produtosRemotos.length
          ? mergeWithDefaults(produtosRemotos)
          : produtosPadrao;

        setProdutos(produtosCompletos);

        try {
          await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosCompletos));
        } catch (error) {
          console.error("Erro ao salvar produtos locais:", error);
        }

        setLoading(false);
      },
      async (error) => {
        console.error("Erro ao carregar produtos do Firestore:", error);

        try {
          const jsonValue = await AsyncStorage.getItem(PRODUTOS_STORAGE_KEY);
          if (jsonValue) {
            setProdutos(JSON.parse(jsonValue));
          }
        } catch (storageError) {
          console.error("Erro ao carregar fallback local:", storageError);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const carregarProdutos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(PRODUTOS_STORAGE_KEY);
      console.log("Carregando produtos:", jsonValue);
      
      if (jsonValue) {
        setProdutos(JSON.parse(jsonValue));
      } else {
        setProdutos(produtosPadrao);
        await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosPadrao));
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = async (novoProduto) => {
    try {
      const usuario = auth.currentUser;
      if (!usuario) {
        throw new Error("Você precisa estar logado para cadastrar um produto.");
      }

      const produto = {
        ...novoProduto,
        criadoPor: usuario.uid,
        criadoEm: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "produtos"), produto);
      const produtoAdicionado = { id: docRef.id, ...produto };

      setProdutos((currentProdutos) => {
        const produtosAtualizados = [produtoAdicionado, ...currentProdutos];
        AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosAtualizados)).catch((error) => {
          console.error("Erro ao salvar produto local após adicionar:", error);
        });
        return produtosAtualizados;
      });

      return produtoAdicionado;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  };

  const atualizarProduto = async (id, produtoAtualizado) => {
    try {
      const produtosAtualizados = produtos.map(p => 
        p.id === id ? { ...p, ...produtoAtualizado } : p
      );
      setProdutos(produtosAtualizados);
      await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosAtualizados));
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };

  const deletarProduto = async (id) => {
    try {
      if (!id) {
        throw new Error("ID do produto inválido.");
      }

      const produtoId = String(id);
      const usuario = auth.currentUser;
      
      // 1. Validar se o usuário está logado
      if (!usuario) {
        throw new Error("Você precisa estar logado para excluir um produto.");
      }

      console.log("Iniciando exclusão de produto:", produtoId);
      console.log("Usuário:", usuario.uid);

      // 2. Buscar o documento do Firestore (fonte única de verdade)
      const produtoRef = doc(db, "produtos", produtoId);
      const produtoSnapshot = await getDoc(produtoRef);

      // 3. Validar se o produto existe
      if (!produtoSnapshot.exists()) {
        throw new Error("Produto não encontrado no banco de dados.");
      }

      const produtoData = produtoSnapshot.data();
      console.log("Dados do produto:", produtoData);

      // 4. Validar permissão - apenas o criador pode deletar
      if (produtoData.criadoPor && produtoData.criadoPor !== usuario.uid) {
        throw new Error("Você não tem permissão para excluir este produto. Apenas o criador pode deletá-lo.");
      }

      // 5. Se passou em todas as validações, deletar do Firestore
      console.log("✨ Permissões validadas. Deletando...");
      await deleteDoc(produtoRef);
      console.log("Produto deletado do Firestore com sucesso!");

      // 6. Atualizar o estado local
      const produtosAtualizados = produtos.filter((p) => String(p.id) !== produtoId);
      setProdutos(produtosAtualizados);
      
      // 7. Atualizar AsyncStorage
      await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosAtualizados));
      console.log("Estado local atualizado!");

    } catch (error) {
      console.error("Erro ao deletar produto:", error.message || error);
      throw error;
    }
  };

  const value = {
    produtos,
    loading,
    adicionarProduto,
    atualizarProduto,
    deletarProduto,
    carregarProdutos,
  };

  return (
    <ProdutosContext.Provider value={value}>
      {children}
    </ProdutosContext.Provider>
  );
}

export function useProdutosContext() {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error("useProdutosContext deve ser usado dentro de ProdutosProvider");
  }
  return context;
}
