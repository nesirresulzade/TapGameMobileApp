import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';
import { saveGameResult } from '../../firebaseConfig';
import GameResultModal from './GameResultModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GameZone = ({ selectedLevel, onGameEnd }) => {
  // Game constants
  const TARGET_SIZE = 64;
  const PLAY_AREA_PADDING = 16;
  const navigation = useNavigation();
  const [gameStarted, setGameStarted] = useState(false);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const totalTargets = selectedLevel.targets;

  const playArea = useMemo(() => {
    // Use full screen minus small padding
    const usableWidth = SCREEN_WIDTH - PLAY_AREA_PADDING * 2 - TARGET_SIZE;
    const usableHeight = SCREEN_HEIGHT - PLAY_AREA_PADDING * 2 - TARGET_SIZE;
    return { usableWidth: Math.max(usableWidth, 50), usableHeight: Math.max(usableHeight, 50) };
  }, []);

  const randomPosition = useCallback(() => {
    const x = Math.floor(Math.random() * playArea.usableWidth) + PLAY_AREA_PADDING;
    const y = Math.floor(Math.random() * playArea.usableHeight) + PLAY_AREA_PADDING;
    return { x, y };
  }, [playArea]);

  const placeTarget = useCallback(() => {
    setTargetPos(randomPosition());
  }, [randomPosition]);

  const resetGame = useCallback(() => {
    setHits(0);
    setMisses(0);
    setElapsedMs(0);
    setStartTime(0);
    setGameStarted(false);
    setShowResultModal(false);
    setGameResult(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameStarted(true);
    const now = Date.now();
    setStartTime(now);
    placeTarget();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - now);
    }, 50);
  }, [placeTarget, resetGame]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onMiss = useCallback(() => {
    if (!gameStarted || hits >= totalTargets) return;
    setMisses(prev => prev + 1);
  }, [gameStarted, hits, totalTargets]);

  const onHit = useCallback(async () => {
    if (!gameStarted) return;
    
    // Check if game is already completed
    if (hits >= totalTargets) return;
    
    const nextHits = hits + 1;
    setHits(nextHits);
    
    if (nextHits >= totalTargets) {
      // Finish game
      stopTimer();
      setGameStarted(false); // Stop the game immediately
      
      const totalTimeMs = Date.now() - startTime;
      const accuracy = nextHits / (nextHits + misses);
      // Scoring: high hits fast time, penalize misses
      const base = nextHits * 1000; // per target
      const timePenalty = Math.floor(totalTimeMs / 20); // 1 point per 20ms
      const missPenalty = misses * 50;
      const score = Math.max(0, base - timePenalty - missPenalty);
      const timeSec = Math.max(0, Math.round(totalTimeMs / 100) / 10);
      const stars = score >= base * 0.9 ? 3 : score >= base * 0.75 ? 2 : 1;

      try {
        const user = auth.currentUser;
        if (user) {
          await saveGameResult(user.uid, {
            gameType: 'tap',
            level: selectedLevel.targets,
            score,
            time: timeSec,
            stars,
            moves: nextHits,
          });
        }
      } catch (e) {
        // non-blocking
      }

      // Show result modal
      setGameResult({
        score,
        time: timeSec,
        accuracy: (accuracy * 100).toFixed(0),
        stars,
      });
      setShowResultModal(true);
      return;
    }
    placeTarget();
  }, [gameStarted, hits, totalTargets, stopTimer, startTime, misses, selectedLevel, navigation, placeTarget, startGame, onGameEnd]);

  const elapsedText = useMemo(() => {
    const sec = Math.floor(elapsedMs / 1000);
    const ms = Math.floor((elapsedMs % 1000) / 10)
      .toString()
      .padStart(2, '0');
    return `${sec}.${ms}s`;
  }, [elapsedMs]);

  const handleRestart = () => {
    setShowResultModal(false);
    startGame();
  };

  const handleGoHome = () => {
    setShowResultModal(false);
    onGameEnd();
  };

  const handleLeaderboard = () => {
    setShowResultModal(false);
    navigation.navigate('Leaderboard');
  };

  return (
    <View style={styles.gameZone}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onGameEnd}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Game Stats Overlay */}
      <View style={styles.gameStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Hədəf</Text>
          <Text style={styles.statValue}>{hits}/{totalTargets}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Zaman</Text>
          <Text style={styles.statValue}>{gameStarted ? elapsedText : '0.00s'}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Səhv</Text>
          <Text style={styles.statValue}>{misses}</Text>
        </View>
      </View>

      {/* Start Button */}
      {!gameStarted && (
        <View style={styles.startButtonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Ionicons name="flash" color="#ffffff" size={24} />
            <Text style={styles.startButtonText}>Oyunu Başlat</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Game Area */}
      <TouchableOpacity style={styles.playArea} activeOpacity={1} onPress={onMiss}>
        {gameStarted && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onHit}
            style={[styles.target, { left: targetPos.x, top: targetPos.y }]}
          >
            <Ionicons name="radio-button-on" size={36} color="#fff" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Game Result Modal */}
      <GameResultModal
        visible={showResultModal}
        onClose={() => setShowResultModal(false)}
        gameResult={gameResult}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
        onLeaderboard={handleLeaderboard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gameZone: {
    flex: 1,
    backgroundColor: '#0f1419',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 20,
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#27ae60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gameStats: {
    position: 'absolute',
    top: 50,
    left: 80,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  statItem: {
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27ae60',
    alignItems: 'center',
    minWidth: 60,
  },
  statLabel: {
    color: '#a8a8a8',
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  startButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  startButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  playArea: {
    flex: 1,
    position: 'relative',
  },
  target: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#c0392b',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default GameZone;
