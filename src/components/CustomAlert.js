import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomAlert = ({ 
  visible, 
  title, 
  message, 
  buttons = [], 
  type = 'info', // 'info', 'success', 'warning', 'error'
  onClose 
}) => {
  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#27ae60' };
      case 'warning':
        return { name: 'warning', color: '#f39c12' };
      case 'error':
        return { name: 'close-circle', color: '#e74c3c' };
      default:
        return { name: 'information-circle', color: '#3498db' };
    }
  };

  const getAlertColors = () => {
    switch (type) {
      case 'success':
        return {
          borderColor: '#27ae60',
          iconBg: '#27ae60',
          titleColor: '#27ae60'
        };
      case 'warning':
        return {
          borderColor: '#f39c12',
          iconBg: '#f39c12',
          titleColor: '#f39c12'
        };
      case 'error':
        return {
          borderColor: '#e74c3c',
          iconBg: '#e74c3c',
          titleColor: '#e74c3c'
        };
      default:
        return {
          borderColor: '#3498db',
          iconBg: '#3498db',
          titleColor: '#3498db'
        };
    }
  };

  const colors = getAlertColors();
  const icon = getAlertIcon();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.alertContainer, { borderColor: colors.borderColor }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
            <Ionicons name={icon.name} size={32} color="#ffffff" />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.titleColor }]}>
              {title}
            </Text>
            <Text style={styles.message}>
              {message}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'destructive' && styles.destructiveButton,
                  button.style === 'cancel' && styles.cancelButton,
                  buttons.length === 1 && styles.singleButton,
                  index === 0 && buttons.length > 1 && styles.firstButton,
                  index === buttons.length - 1 && buttons.length > 1 && styles.lastButton,
                ]}
                onPress={() => {
                  if (button.onPress) {
                    button.onPress();
                  }
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <Text style={[
                  styles.buttonText,
                  button.style === 'destructive' && styles.destructiveButtonText,
                  button.style === 'cancel' && styles.cancelButtonText,
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#a8a8a8',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  singleButton: {
    backgroundColor: '#27ae60',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  firstButton: {
    backgroundColor: '#3498db',
    borderWidth: 1,
    borderColor: '#5dade2',
  },
  lastButton: {
    backgroundColor: '#27ae60',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  destructiveButton: {
    backgroundColor: '#e74c3c',
    borderWidth: 1,
    borderColor: '#c0392b',
  },
  cancelButton: {
    backgroundColor: '#7f8c8d',
    borderWidth: 1,
    borderColor: '#95a5a6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#ffffff',
  },
  cancelButtonText: {
    color: '#ffffff',
  },
});

export default CustomAlert;
