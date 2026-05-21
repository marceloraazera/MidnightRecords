import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRODUTOS_STORAGE_KEY = "@midnight_produtos";

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos do AsyncStorage
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(PRODUTOS_STORAGE_KEY);
      if (jsonValue) {
        setProdutos(JSON.parse(jsonValue));
      } else {
        // Produtos padrão
        const produtosPadrao = [
          { id: 1, nome: "The Queen Is Dead", preco: "R$ 250,00", imagem: "🎵" },
          { id: 2, nome: "Super Real Me", preco: "R$ 250,00", imagem: "🎵" },
          { id: 3, nome: "Ocean Blvd", preco: "R$ 250,00", imagem: "🎵" },
          { id: 4, nome: "GUTS", preco: "R$ 250,00", imagem: "🎵" },
        ];
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
      const id = Math.max(0, ...produtos.map(p => p.id)) + 1;
      const produto = {
        ...novoProduto,
        id,
      };
      const produtosAtualizados = [...produtos, produto];
      setProdutos(produtosAtualizados);
      await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosAtualizados));
      return produto;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  };

  const atualizarProduto = async (id, produtoAtualizado) => {
    try {
      const produtosAtualizados = produtos.map(p => p.id === id ? { ...p, ...produtoAtualizado } : p);
      setProdutos(produtosAtualizados);
      await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosAtualizados));
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };

  const deletarProduto = async (id) => {
    try {
      const produtosAtualizados = produtos.filter(p => p.id !== id);
      setProdutos(produtosAtualizados);
      await AsyncStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtosAtualizados));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  };

  return {
    produtos,
    loading,
    adicionarProduto,
    atualizarProduto,
    deletarProduto,
    carregarProdutos,
  };
}
