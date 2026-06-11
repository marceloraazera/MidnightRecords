import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

/**
 * Modal de confirmação customizado seguindo a identidade visual do app.
 *
 * Props:
 *  - visible: bool
 *  - title: string
 *  - message: string
 *  - confirmText: string (padrão "Confirmar")
 *  - cancelText: string (padrão "Cancelar")
 *  - confirmDanger: bool — deixa o botão de confirmar vermelho
 *  - icon: nome de ícone Feather (opcional)
 *  - onConfirm: () => void
 *  - onCancel: () => void
 */
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmDanger = false,
  icon,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {icon && (
                <View style={[styles.iconWrap, confirmDanger && styles.iconWrapDanger]}>
                  <Feather
                    name={icon}
                    size={28}
                    color={confirmDanger ? '#ff4d4d' : '#D4A74F'}
                  />
                </View>
              )}

              <Text style={styles.title}>{title}</Text>
              {!!message && <Text style={styles.message}>{message}</Text>}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onCancel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmBtn, confirmDanger && styles.confirmBtnDanger]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    backgroundColor: '#1A1128',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,167,79,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212,167,79,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapDanger: {
    backgroundColor: 'rgba(255,77,77,0.12)',
  },
  title: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    color: '#9CA3AF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelText: {
    color: '#CCF7E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#D4A74F',
    alignItems: 'center',
  },
  confirmBtnDanger: {
    backgroundColor: '#ff4d4d',
  },
  confirmText: {
    color: '#15101F',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },
});
