import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import QuantityControl from '../../components/QuantityControl';
import ConfirmModal from '../../components/ConfirmModal';
import Feather from '@expo/vector-icons/Feather';

export default function CarrinhoScreen() {
  const router = useRouter();
  const { items, increase, decrease, removeItem, totalQuantity, totalPrice } = useCart();

  // Estado do modal de confirmação
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);
  const [pendingRemoveName, setPendingRemoveName] = useState('');

  const handleRemove = (id, nome) => {
    setPendingRemoveId(id);
    setPendingRemoveName(nome);
    setModalVisible(true);
  };

  const confirmRemove = () => {
    if (pendingRemoveId) removeItem(pendingRemoveId);
    setModalVisible(false);
    setPendingRemoveId(null);
    setPendingRemoveName('');
  };

  const cancelRemove = () => {
    setModalVisible(false);
    setPendingRemoveId(null);
    setPendingRemoveName('');
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="shopping-cart" size={48} color="#D4A74F" style={{ marginBottom: 16 }} />
        <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={18} color="#15101F" />
          <Text style={styles.backButtonText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={item.imagem} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.nome}
              </Text>
              <Text style={styles.itemPrice}>
                R$ {Number(item.preco).toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.itemSubtotal}>
                Subtotal: R$ {(Number(item.preco) * item.quantidade).toFixed(2).replace('.', ',')}
              </Text>
            </View>
            <View style={styles.rightCol}>
              <QuantityControl
                quantity={item.quantidade}
                onIncrease={() => increase(item.id)}
                onDecrease={() => decrease(item.id)}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.id, item.nome)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="trash-2" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Resumo fixo no rodapé */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Itens</Text>
          <Text style={styles.summaryValue}>{totalQuantity}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValueHighlight}>
            R$ {Number(totalPrice).toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.85}>
          <Text style={styles.checkoutButtonText}>Continuar compra</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmação de remoção */}
      <ConfirmModal
        visible={modalVisible}
        icon="trash-2"
        title="Remover item"
        message={`Deseja remover "${pendingRemoveName}" do carrinho?`}
        confirmText="Remover"
        cancelText="Cancelar"
        confirmDanger
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15101F',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 180,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,167,79,0.15)',
  },
  itemImage: {
    width: 68,
    height: 68,
    borderRadius: 10,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    marginBottom: 2,
  },
  itemPrice: {
    color: '#CCF7E4',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    marginBottom: 2,
  },
  itemSubtotal: {
    color: '#D4A74F',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },
  rightCol: {
    alignItems: 'center',
    gap: 10,
    paddingLeft: 8,
  },
  removeButton: {
    padding: 6,
    backgroundColor: 'rgba(255,77,77,0.12)',
    borderRadius: 8,
  },
  summaryBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,167,79,0.3)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#9CA3AF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  summaryValueHighlight: {
    color: '#D4A74F',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  checkoutButton: {
    marginTop: 12,
    backgroundColor: '#D4A74F',
    borderRadius: 28,
    paddingVertical: 13,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#15101F',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15101F',
    padding: 24,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCF7E4',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  backButtonText: {
    color: '#15101F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});
