import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const { totalQuantity } = useCart();
  if (!totalQuantity) return null;
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{totalQuantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#D4A74F',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#15101F',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 10,
  },
});
