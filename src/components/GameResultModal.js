import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingModal from './LoadingModal';

const GameResultModal = ({ visible, onClose, gameResult, onRestart, onGoHome, onLeaderboard }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const blurAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { score, time, accuracy, stars } = gameResult || {};

  useEffect(() => {
    if (showLoading) {
      Animated.parallel([
        Animated.timing(blurAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(blurAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showLoading]);

  const getStarDisplay = () => {
    const starArray = [];
    for (let i = 0; i < 3; i++) {
      starArray.push(
        <Ionicons
          key={i}
          name={i < stars ? "star" : "star-outline"}
          size={24}
          color={i < stars ? "#f1c40f" : "#a8a8a8"}
        />
      );
    }
    return starArray;
  };

  const getPerformanceText = () => {
    if (stars === 3) return "Əla!";
    if (stars === 2) return "Yaxşı!";
    if (stars === 1) return "Orta";
    return "Cəhd edin!";
  };

  const getPerformanceColor = () => {
    if (stars === 3) return "#27ae60";
    if (stars === 2) return "#f39c12";
    if (stars === 1) return "#e67e22";
    return "#e74c3c";
  };

  const handleRestart = () => {
    setLoadingMessage('Oyun yenidən başladılır...');
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      onRestart();
    }, 2000);
  };

  const handleGoHome = () => {
    setLoadingMessage('Ana səhifəyə keçilir...');
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      onGoHome();
    }, 2000);
  };

  const handleLeaderboard = () => {
    setLoadingMessage('Liderlər cədvəlinə keçilir...');
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      onLeaderboard();
    }, 2000);
  };

  if (!gameResult) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[
          styles.modalContent,
          {
            opacity: blurAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🎉 Oyun Bitdi!</Text>
            <Text style={[styles.performanceText, { color: getPerformanceColor() }]}>
              {getPerformanceText()}
            </Text>
          </View>

          {/* Stars */}
          <View style={styles.starsContainer}>
            {getStarDisplay()}
          </View>

          {/* Results */}
          <View style={styles.resultsContainer}>
            <View style={styles.resultItem}>
              <Ionicons name="trophy" size={24} color="#f1c40f" />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultLabel}>Xal</Text>
                <Text style={styles.resultValue}>{score.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.resultItem}>
              <Ionicons name="time" size={24} color="#3498db" />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultLabel}>Zaman</Text>
                <Text style={styles.resultValue}>{time}s</Text>
              </View>
            </View>

            <View style={styles.resultItem}>
              <Ionicons name="target" size={24} color="#e74c3c" />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultLabel}>Dəqiqlik</Text>
                <Text style={styles.resultValue}>{accuracy}%</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.restartButton]}
              onPress={handleRestart}
            >
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Yenidən</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.homeButton]}
              onPress={handleGoHome}
            >
              <Ionicons name="home" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Ana Səhifə</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.leaderboardButton]}
              onPress={handleLeaderboard}
            >
              <Ionicons name="trophy" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Liderlər</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Loading Modal */}
      <LoadingModal
        visible={showLoading}
        message={loadingMessage}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#27ae60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  performanceText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 8,
  },
  resultsContainer: {
    marginBottom: 25,
    gap: 15,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f3460',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27ae60',
    gap: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#a8a8a8',
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  restartButton: {
    backgroundColor: '#27ae60',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  homeButton: {
    backgroundColor: '#3498db',
    borderWidth: 1,
    borderColor: '#5dade2',
  },
  leaderboardButton: {
    backgroundColor: '#f39c12',
    borderWidth: 1,
    borderColor: '#f4d03f',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameResultModal;
