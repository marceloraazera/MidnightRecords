import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load persisted cart on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem('@cart_items');
        if (saved) setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    };
    loadCart();
  }, []);

  // Persist whenever items change
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('@cart_items', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart', e);
      }
    };
    saveCart();
  }, [items]);

  const addItem = (newItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantidade: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const increase = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i))
    );
  };

  const decrease = (id) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const newQty = i.quantidade - 1;
        return newQty < 1 ? i : { ...i, quantidade: newQty };
      })
    );
  };

  const totalQuantity = items.reduce((sum, i) => sum + i.quantidade, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.preco * i.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        increase,
        decrease,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
