import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function QuantityControl({ quantity, onIncrease, onDecrease }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} style={styles.button} activeOpacity={0.7}>
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} style={styles.button} activeOpacity={0.7}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    backgroundColor: '#1C5544',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  quantity: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },
});
