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
      console.log("=== INICIANDO EXCLUSÃO NO CONTEXTO ===");
      console.log("ID a excluir:", produtoId);
      
      const usuario = auth.currentUser;
      console.log("Usuário logado:", usuario?.uid, usuario?.email);
      
      if (!usuario) {
        throw new Error("Você precisa estar logado para excluir um produto.");
      }

      const produto = produtos.find((p) => String(p.id) === produtoId);
      console.log("Produto encontrado localmente:", produto?.id, produto?.nome);
      console.log("criadoPor do produto:", produto?.criadoPor);
      console.log("UID do usuário:", usuario.uid);
      console.log("São iguais?", produto?.criadoPor === usuario.uid);
      
      if (!produto) {
        console.warn("Produto não encontrado no estado, mas continuando para tentar excluir...");
      } else if (produto.criadoPor && produto.criadoPor !== usuario.uid) {
        throw new Error("Você só pode excluir produtos criados por você.");
      }

      console.log("Tentando deletar de produtos com ID:", produtoId);
      await deleteDoc(doc(db, "produtos", produtoId));
      console.log("✓ Deletado do Firestore com sucesso");

      const produtosAtualizados = produtos.filter((p) => String(p.id) !== produtoId);
      console.log("Produtos antes:", produtos.length, "Produtos depois:", produtosAtualizados.length);
      
      setProdutos(produtosAtualizados);
      await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosAtualizados));
      console.log("✓ Estado local atualizado");
    } catch (error) {
      console.error("❌ Erro ao deletar produto:", error);
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
